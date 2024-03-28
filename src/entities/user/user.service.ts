import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityMetadata,
  FindManyOptions,
  FindOneOptions,
  In,
  Like, Not,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import _ from 'underscore';
import * as bcrypt from 'bcryptjs';

import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { CreateUserDto } from '@src/entities/user/dto/create-user.dto';
import { User } from '@src/entities/user/user.entity';
import { HelperService } from '@src/helper/helper.service';
import { Task } from '@src/entities/task/task.entity';
import { Company } from '@src/entities/company/company.entity';
import {GetUsersOptionsInterface} from "@src/interfaces/get-users-options.interface";
import {Tag} from "@src/entities/tag/tag.entity";
import {GetFilterCountUsersResponseInterface} from "@src/interfaces/get-filterCountUsers-response.interface";
import {UserDataInterface} from "@src/interfaces/user-data.interface";


type UserDataType = {
  id: number;
  name: string;
  phone: string;
  type: string;
  tasks: Task[];
  hasOnboard: boolean;
  companyId: number;
  company: Company;
  tags: string[];
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly helperService: HelperService,
  ) {}

  async getAll(reqQuery: GetUsersOptionsInterface, currentUserId: number): Promise<{ success: boolean; data: { users: UserDataInterface[], filterCounts: GetFilterCountUsersResponseInterface; } }> {
    try {
      const user: User = await this.getOneUser({ id: currentUserId });
      const { companyId } = user;

      const { search, type } = reqQuery;

      const users: User[] = await this.getAllUsers({ search, type, companyId });
      const returnedUsers: UserDataInterface[] = [];
      for (const u of users) {
        returnedUsers.push(this.getUserData(u));
      }

      const filterCounts: GetFilterCountUsersResponseInterface = await this.getFilterCountUsers(companyId);

      return {
        success: true,
        data: { users: returnedUsers, filterCounts },
      };
    } catch (e) {
      this.logger.error(`Error during get all users: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllUsers(options: GetUsersOptionsInterface): Promise<User[]> {
    const query: FindManyOptions<User> = {
      where: {},
      relations: ['tags', 'tasks'],
      order: { id: 'ASC' },
    };

    if (options.companyId) {
      if (!options.ids?.includes(10000)) {
        query.where = { ...(query.where || {}), companyId: options.companyId };
      }
    }

    if (options.ids?.length) {
      query.where = { ...(query.where || {}), id: In(options.ids) };
      // query.where.id = In(options.ids);
    }

    if (options.type) {
      query.where = { ...(query.where || {}), type: options.type };
      // query.where.type = options.type;
    }

    if (options.search) {
      query.where = { ...(query.where || {}), name: Like(`%${options.search}%`) };
      // query.where.name = Like(`%${options.search}%`);
    }

    if (options.limit) {
      query.take = options.limit;
    }

    return await this.userRepository.find(query);
  }

  async getFilterCountUsers(companyId: number): Promise<GetFilterCountUsersResponseInterface> {
    const users: User[] = await this.getAllUsers({ companyId });
    const groupUsers: _.Dictionary<User[]> = _.groupBy(users, 'type');

    const filterCounts: GetFilterCountUsersResponseInterface = {
      admins: 0,
      managers: 0,
      workers: 0,
      all: 0,
    };

    for (const type in groupUsers) {
      if (_.has(groupUsers, type)) {
        const userGroup: User[] = groupUsers[type];
        filterCounts[`${type.toLowerCase()}s`] = userGroup.length;
      }
    }

    // for (const type in groupUsers) {
    //   filterCounts[`${type.toLowerCase()}s`] = groupUsers[type].length;
    // }

    let all: number = 0;

    _.each(filterCounts, (count) => {
      all += count;
    });

    // for (const type in filterCounts) {
    //   all += filterCounts[type];
    // }

    filterCounts.all = all;

    return filterCounts;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const currentUser = await this.userRepository.findOne({ where: { phone: dto.phone } });
      if (currentUser) {
        throw new HttpException(`User with phone ${currentUser.phone} already exists`, HttpStatus.FOUND);
      }

      const hashPassword = await bcrypt.hash(dto.password, 5);

      const userForCreate = this.userRepository.create({ ...dto, password: hashPassword });

      let user = await this.userRepository.save(userForCreate);

      this.logger.log(`User created: ${user.name}`);

      return user;
    } catch (e) {
      this.logger.error(`Error during user creation: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getOneUser(findQuery: GetUsersOptionsInterface): Promise<User> {
    try {
      const selectFields: string[] = await this.helperService.getEntityFields(this.userRepository, [], true, false);
      const selectObject: Record<string, true> = {};
      // const selectObject: { [key: string]: true } = {};

      selectFields.forEach((field) => {
        selectObject[field] = true;
      });

      const query: FindOneOptions<User> = {
        select: {
          ...selectObject,
          tags: {
            id: true,
            name: true,
          },
        },
        where: findQuery,
        relations: ['tags', 'company'],
      };

      return await this.userRepository.findOne(query);
    } catch (e) {
      this.logger.error(`Error during get user: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  getUserData(user: User): UserDataInterface {
    const data: Partial<UserDataInterface> = _.pick(user, ['id', 'name', 'phone', 'type', 'tags', 'tasks', 'hasOnboard', 'companyId', 'company']);
    data.tags = data.tags as string[];
    // data.tags = data.tags.map((tag: { name: string }) => tag.name);
    // data.tags = data.tags.map((tag: any) => tag.name);
    return data as UserDataInterface;
  }

  // getUserData(user: User) {
  //   const data: any = _.pick(user, [
  //     'id',
  //     'name',
  //     'phone',
  //     'type',
  //     'tags',
  //     'tasks',
  //     'hasOnboard',
  //     'companyId',
  //     'company',
  //   ]);
  //   data.tags = data.tags.map((tag) => tag.name);
  //   return data;
  // }

  // getUserData(user: User): UserDataType {
  //   const { id, name, phone, type, tags, tasks, hasOnboard, companyId, company } = user;
  //   const tagNames = tags.map((tag) => tag.name);
  //
  //   return {
  //     id,
  //     name,
  //     phone,
  //     type,
  //     tags: tagNames,
  //     tasks,
  //     hasOnboard,
  //     companyId,
  //     company,
  //   };
  // }

  async findByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getWorkers(workerOptions: GetUsersOptionsInterface, currentUserId: number): Promise<{ success: boolean; data: { workers: User[]; } }> {
    try {
      const user: User = await this.getOneUser({ id: currentUserId });

      let { search, ids } = workerOptions;
      const { companyId } = user;

      if (typeof ids === 'string') {
        ids = [ids];
      }

      const workers: User[] = await this.getAllWorkers({ search, ids, companyId });

      return {
        success: true,
        data: { workers },
      };

    } catch (e) {
      this.logger.error(`Error during get all workers: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllWorkers(options: GetUsersOptionsInterface): Promise<User[]> {
    let query: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name'])
      .orderBy('user.name', 'ASC')
      .take(10);

    if (options.companyId) {
      query = query.where('user.companyId = :companyId', { companyId: options.companyId });
    }

    if (options.ids?.length) {
      query = query.andWhere('user.id NOT IN (:...ids)', { ids: options.ids });
    }

    if (options.search) {
      query = query.andWhere('user.name ILIKE :search', { search: `%${options.search}%` });
    }

    const users: User[] = await query.getMany();
    return users;
  }

  async updateOnboardUser(currentUserId: number): Promise<{ success: boolean; notice: string; userId: number; }>  {
    try {
      const user: User = await this.getOneUser({ id: currentUserId });

      if (!user) {
        throw { status: 404, message: '404-user-not-found', stack: new Error().stack };
      }

      await this.updateOnboard(user);

      return {
        success: true,
        notice: '200-user-has-been-removed-successfully',
        userId: currentUserId,
      };
    } catch (e) {
      this.logger.error(`Error during update onboard user: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async updateOnboard(user: User): Promise<void> {
    await this.userRepository.update(user.id, { hasOnboard: true });
  }
}
