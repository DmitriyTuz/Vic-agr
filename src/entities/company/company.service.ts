import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "@src/entities/company/company.entity";
import {CreateCompanyDto} from "@src/entities/company/dto/create-company.dto";
import {User} from "@src/entities/user/user.entity";
import {FoundCompanyException} from "@src/exceptions/found-company-exception";

@Injectable()
export class CompanyService {

  constructor(
      @InjectRepository(Company)
      private companyRepository: Repository<Company>,

  ) {}

  async createCompany(newCompany: CreateCompanyDto) {

    const company: Company = await this.companyRepository.findOne({ where: { name: newCompany.name } });
    if (company) {
      // throw new HttpException(`company-with-name- ${company.name} -already-exists`, HttpStatus.FOUND);
      throw new FoundCompanyException(company.name);
    }

    return  await this.companyRepository.save(newCompany);

  }
}
