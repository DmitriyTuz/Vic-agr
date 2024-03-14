import {Body, Controller, Get, HttpException, Post, UsePipes} from '@nestjs/common';
import { UserService } from '@src/entities/user/user.service';
import { CreateUserDto } from '@src/entities/user/dto/create-user.dto';
import { User } from '@src/entities/user/user.entity';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ValidationPipe} from "@src/pipes/validation.pipe";

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
