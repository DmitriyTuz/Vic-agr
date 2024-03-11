import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersController} from "@src/entities/users/users.controller";
import {UsersService} from "@src/entities/users/users.service";
import {User} from "@src/entities/users/users.entity";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UsersService]
})
export class UsersModule {}
