import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm/typeorm.module';
import {UsersModule} from "@src/entities/users/users.module";
import { TagsModule } from './entities/tags/tags.module';

@Module({
  imports: [
    TypeormModule,
    UsersModule,
    TagsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
