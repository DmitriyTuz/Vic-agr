import {Body, Controller, Get, HttpException, Post, UsePipes} from '@nestjs/common';
import { UsersService } from '@src/entities/users/users.service';
import { CreateUserDto } from '@src/entities/users/dto/create-user.dto';
import { User } from '@src/entities/users/users.entity';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ValidationPipe} from "@src/pipes/validation.pipe";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('create-user')
  @ApiOperation({summary: 'User creation'})
  @ApiResponse({status: 200, type: User})
  @UsePipes(ValidationPipe)
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Get('get-all-users')
  async findAll() {
    throw new HttpException('Какая-то ошибка', 400);
    return this.userService.findAll();
  }
}
