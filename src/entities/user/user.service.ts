import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {EntityManager, EntityMetadata, FindOneOptions, In, Like, Repository} from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import _ from 'underscore';
import * as bcrypt from 'bcryptjs';

import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { CreateUserDto } from '@src/entities/user/dto/create-user.dto';
import { User } from '@src/entities/user/user.entity';
import { HelperService } from '@src/helper/helper.service';
import {Task} from "@src/entities/task/task.entity";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly helperService: HelperService,
  ) {}

  async getAll(reqBody, currentUserId, req) {
    try {
      const user = await this.getOneUser({id: currentUserId});
      const {companyId} = user;

      const {search, type} = req.query;

      const users = await this.getAllUsers({search, type, companyId});
      const returnedUsers = [];
      for (const u of users) {
        returnedUsers.push(this.getUserData(u));
      }

      const filterCounts = await this.getFilterCount(companyId);

      return {
        success: true,
        data: {users: returnedUsers, filterCounts}
      };

    } catch (e) {
      this.logger.error(`Error during get all users: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllUsers(reqBody: any): Promise<User[]> {
    const query: any = {
      where: {},
      relations: ['tags', 'tasks'],
      order: { id: 'ASC' },
    };

    if (reqBody.companyId) {
      if (!reqBody.ids?.includes(10000)) {
        query.where.companyId = reqBody.companyId;
      }
    }

    if (reqBody.ids?.length) {
      query.where.id = In(reqBody.ids);
    }

    if (reqBody.type) {
      query.where.type = reqBody.type;
    }

    if (reqBody.search) {
      query.where.name = Like(`%${reqBody.search}%`);
    }

    if (reqBody.limit) {
      query.take = reqBody.limit;
    }

    return await this.userRepository.find(query);
  }

  async getFilterCount(companyId) {
    const users = await this.getAllUsers({companyId});
    const groupUsers = _.groupBy(users, 'type');

    const filterCounts = {
      admins: 0,
      managers: 0,
      workers: 0,
      all: 0
    };

    for (const type in groupUsers) {
      filterCounts[`${type.toLowerCase()}s`] = groupUsers[type].length;
    }

    let all = 0

    for (const type in filterCounts) {
      all += filterCounts[type];
    }

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

  async getOneUser(findQuery: any): Promise<User> {
    try {
      const selectFields: string[] = await this.helperService.getEntityFields(this.userRepository, [], true, false);

      const selectObject: { [key: string]: true } = {};
      selectFields.forEach((field) => {
        selectObject[field] = true;
      });

      const options: FindOneOptions<User> = {
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

      return await this.userRepository.findOne(options);
    } catch (e) {
      this.logger.error(`Error during get user: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  getUserData(user: User) {
    const data: any = _.pick(user, [
      'id',
      'name',
      'phone',
      'type',
      'tags',
      'tasks',
      'hasOnboard',
      'companyId',
      'company',
    ]);
    data.tags = data.tags.map((tag) => tag.name);
    return data;
  }

  async findByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getAllWorkers(tagOptions, currentUserId) {
    try {
      const user = await this.getOneUser({ id: currentUserId });

      let { search, ids } = tagOptions;
      const { companyId } = user;

      if (typeof ids === 'string') {
        ids = [ids];
      }

      const workers = await this.getWorkers({ search, ids, companyId });

      const response = {
        success: true,
        data: { workers },
      };

      return response;
    } catch (e) {
      this.logger.error(`Error during get all workers: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getWorkers({ ids, search, companyId }) {
    let query = this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.name'])
        .orderBy('user.name', 'ASC')
        .take(10);

    if (companyId) {
      query = query.where('user.companyId = :companyId', { companyId });
    }

    if (ids?.length) {
      query = query.andWhere('user.id NOT IN (:...ids)', { ids });
    }

    if (search) {
      query = query.andWhere('user.name ILIKE :search', { search: `%${search}%` });
    }

    const users = await query.getMany();
    return users;
  }

  async updateOnboardUser(currentUserId) {
    try {
      const user = await this.getOneUser({id: currentUserId});

      if (!user) {
        throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
      }

      await this.updateOnboard(user);

      return {
        success: true,
        notice: '200-user-has-been-removed-successfully',
        userId: currentUserId
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
