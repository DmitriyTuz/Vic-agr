// import { Injectable } from '@nestjs/common';
// import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
// import {DeepPartial, EntityManager} from "typeorm";
// import {Company} from "@src/entities/company/company.entity";
//
// @Injectable()
// export class SeedsService {
//   private shouldSeed: boolean = false;
//
//   constructor(
//       @InjectEntityManager() private readonly entityManager: EntityManager,
//   ) {}
//
//   enableSeeding(): void {
//     this.shouldSeed = true;
//   }
//
//   async seedData() {
//     // const usersData = [
//     //   { name: 'User1', email: 'user1@gmail.com', password: '11111' },
//     //   { name: 'User2', email: 'user2@gmail.com', password: '11111' },
//     //   { name: 'User3', email: 'user3@gmail.com', password: '11111' },
//     // ];
//     //
//     // await this.entityManager.transaction(async transactionalEntityManager => {
//     //   for (const userData of usersData) {
//     //     const user = transactionalEntityManager.create(User, userData);
//     //     await transactionalEntityManager.save(User, user);
//     //   }
//     // });
//
//     const companiesData = [
//       {logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company One'},
//       {logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company Two'},
//       {logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company Three'},
//     ];
//
//     await this.entityManager.transaction(async transactionalEntityManager => {
//       for (const companyData of companiesData) {
//         const company = transactionalEntityManager.create(Company, companyData as DeepPartial<Company>);
//         await transactionalEntityManager.save(Company, company);
//       }
//     });
//
//     process.exit(0);
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@src/entities/company/company.entity';
import { UserTypes } from '@lib/constants';
import { User } from '@src/entities/user/user.entity';
import { UserService } from '@src/entities/user/user.service';
import {Tag} from "@src/entities/tag/tag.entity";

@Injectable()
export class SeedsService {
  private shouldSeed: boolean = false;

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly userService: UserService,
  ) {}

  enableSeeding(): void {
    this.shouldSeed = true;
  }

  async seedData() {
    // const companiesData: any[] = [
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company One',
    //   },
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company Two',
    //   },
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company Three',
    //   },
    // ];
    //
    // for (const companyData of companiesData) {
    //   const company = await this.companyRepository.create(companyData);
    //   await this.companyRepository.save(company);
    // }
    //
    // const companyOne = await this.companyRepository.findOne({ where: { name: 'Company One' } });
    // const companyTwo = await this.companyRepository.findOne({ where: { name: 'Company Two' } });
    // const companyThree = await this.companyRepository.findOne({ where: { name: 'Company Three' } });
    //
    // const usersData: any[] = [
    //   {
    //     name: 'Super Admin',
    //     password: '12345678',
    //     phone: '+100000000000',
    //     type: UserTypes.SUPER_ADMIN,
    //   },
    //   {
    //     name: 'Michael',
    //     password: '12345678',
    //     phone: '+380982920503',
    //     type: UserTypes.ADMIN,
    //     companyId: companyOne.id,
    //   },
    //   {
    //     name: 'Alex',
    //     password: '12345678',
    //     phone: '+380636446032',
    //     type: UserTypes.ADMIN,
    //     companyId: companyTwo.id,
    //   },
    //   {
    //     name: 'Svetlana',
    //     password: '12345678',
    //     phone: '+100000000001',
    //     type: UserTypes.ADMIN,
    //     companyId: companyThree.id,
    //   },
    // ];
    //
    // for (const userData of usersData) {
    //   const user = await this.userService.createUser(userData);
    //   await this.userRepository.save(user);
    // }

    const Michael = await this.userRepository.findOne({select: ['id', 'companyId'], where: {name: 'Michael'}});
    const Alex = await this.userRepository.findOne({select: ['id', 'companyId'], where: {name: 'Alex'}});
    const Svetlana = await this.userRepository.findOne({select: ['id', 'companyId'], where: {name: 'Svetlana'}});

    const tagsData = [
      {name: 'admin', companyId: Michael.companyId},
      {name: 'worker', companyId: Michael.companyId},
      {name: 'manager', companyId: Michael.companyId},
      {name: 'michael', companyId: Michael.companyId},

      {name: 'admin', companyId: Alex.companyId},
      {name: 'worker', companyId: Alex.companyId},
      {name: 'manager', companyId: Alex.companyId},
      {name: 'alex', companyId: Alex.companyId},

      {name: 'admin', companyId: Svetlana.companyId},
      {name: 'worker', companyId: Svetlana.companyId},
      {name: 'manager', companyId: Svetlana.companyId},
      {name: 'svetlana', companyId: Svetlana.companyId},
    ]

    for (const tagData of tagsData) {
      const tag = await this.tagRepository.create(tagData);
      await this.tagRepository.save(tag);
    }

    process.exit(0);
  }
}
