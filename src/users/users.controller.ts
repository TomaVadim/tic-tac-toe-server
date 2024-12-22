import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { parseInitData } from 'src/auth/utils/parse-init-data';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getUser(@Headers('initdata') initdata: string) {
    return this.userService.getUserById(parseInitData(initdata));
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }
}
