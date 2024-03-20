import { Module } from '@nestjs/common';
import { CompanyService } from '@src/entities/company/company.service';
import { CompanyController } from '@src/entities/company/company.controller';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
