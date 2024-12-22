import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserById(userData: User): Promise<User> {
    const user = await this.userModel.findOne({ id: userData.id });

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }
}
