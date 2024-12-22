import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async join(userData: User): Promise<{ isVerified: boolean }> {
    const existedUser = await this.userModel.findOne({ id: userData.id });

    if (existedUser) {
      return { isVerified: true };
    }

    const newUser = new this.userModel({
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      language_code: userData.language_code,
      allows_write_to_pm: userData.allows_write_to_pm,
      photo_url: userData.photo_url,
    });

    await newUser.save();

    return { isVerified: true };
  }
}
