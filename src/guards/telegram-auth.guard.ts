import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['initdata'];

    if (!this.BOT_TOKEN) {
      throw new Error('BOT_TOKEN is not set in environment variables');
    }

    if (!initData) {
      throw new UnauthorizedException('initData header is missing');
    }

    if (!this.verifyInitData(initData)) {
      throw new UnauthorizedException('Invalid initData hash');
    }

    return true;
  }

  private verifyInitData(initData: string): boolean {
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.BOT_TOKEN)
      .digest();

    const data = Object.fromEntries(
      initData.split('&').map((pair) => {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        return [key, value];
      }),
    );

    if (!data.hash) {
      throw new UnauthorizedException('Hash is missing in initData');
    }

    const { hash, ...dataToCheck } = data;

    const dataCheckString = Object.entries(dataToCheck)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return computedHash === hash;
  }
}
