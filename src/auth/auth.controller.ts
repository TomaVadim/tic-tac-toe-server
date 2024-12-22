import { Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { parseInitData } from './utils/parse-init-data';

@Controller('join')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async join(@Headers('initdata') initdata: string) {
    return this.authService.join(parseInitData(initdata));
  }
}
