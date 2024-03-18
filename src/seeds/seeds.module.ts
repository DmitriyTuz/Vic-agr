import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "@src/entities/company/company.entity";
import {User} from "@src/entities/user/user.entity";
import {UserModule} from "@src/entities/user/user.module";

@Module({
  providers: [SeedsService],
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    UserModule
  ]
})
export class SeedsModule {}
