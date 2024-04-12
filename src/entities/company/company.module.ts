import { Module } from '@nestjs/common';
import { CompanyService } from '@src/entities/company/company.service';
import { CompanyController } from '@src/entities/company/company.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "@src/entities/company/company.entity";

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    TypeOrmModule.forFeature([Company]),
  ],
  exports: [
    CompanyService
  ]

})
export class CompanyModule {}
