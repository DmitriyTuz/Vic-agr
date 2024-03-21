import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TagController} from "@src/entities/tag/tag.controller";
import {TagService} from "@src/entities/tag/tag.service";
import {Tag} from "@src/entities/tag/tag.entity";
import {UserModule} from "@src/entities/user/user.module";

@Module({
  controllers: [TagController],

  providers: [TagService],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    UserModule
  ],
  exports: [TagService]
})
export class TagModule {}
