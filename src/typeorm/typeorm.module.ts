import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from '@src/typeorm/typeorm.config';
import {TypeOrmConfigModule} from "@src/typeorm/typeorm.config.module";
import {DataSource} from "typeorm";
// import { TypeoOrmConfigModule } from './typeorm.config.module';

// @Module({
//   imports: [TypeOrmConfigModule, TypeOrmModule.forRootAsync({
//     imports: [TypeOrmConfigModule],
//     inject: ['DATA_SOURCE'],
//     useFactory: async (dataSource: DataSource) => dataSource.options,
//   })],
//   exports: [TypeOrmModule],
// })
// export class TypeormModule {}

@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options), TypeOrmConfigModule],
  exports: [TypeOrmModule],
})
export class TypeormModule {}
