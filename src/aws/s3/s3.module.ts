import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import {S3Controller} from "@src/aws/s3/s3.controller";
import {AwsConfigModule} from "@src/aws/config/aws.config.module";
import {S3Service} from "@src/aws/s3/s3.service";


@Module({
  imports: [
    // MulterModule.register({
    //     dest: './uploads',
    // }),
    AwsConfigModule,
  ],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
