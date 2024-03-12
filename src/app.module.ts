import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm/typeorm.module';
import {UsersModule} from "@src/entities/users/users.module";

@Module({
  imports: [
    TypeormModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
