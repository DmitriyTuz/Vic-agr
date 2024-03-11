import {
  Body,
  Controller, Get, HttpException,
  Post
} from '@nestjs/common';

import {UsersService} from "@src/entities/users/users.service";
import {CreateUserDto} from "@src/entities/users/dto/create-user.dto";
import {User} from "@src/entities/users/users.entity";

@Controller('users')

export class UsersController {

  constructor(private userService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get('get-all-users')
  async findAll() {
    throw new HttpException('Какая-то ошибка', 400);
    return this.userService.findAll();
  }

}
