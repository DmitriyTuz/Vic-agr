import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {appDataSource} from "@src/typeorm/typeorm.config";

@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options)],
  exports: [TypeOrmModule],
})
export class TypeormModule {}
