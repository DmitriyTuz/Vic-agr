import { Module } from '@nestjs/common';
import {TypeormModule} from "@src/typeorm/typeorm.module";

import {UsersModule} from "@src/entities/users/users.module";
import {TagsModule} from "@src/entities/tags/tags.module";
import {CompaniesModule} from "@src/entities/companies/companies.module";


@Module({
  imports: [
    TypeormModule,
    UsersModule,
    TagsModule,
    CompaniesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
