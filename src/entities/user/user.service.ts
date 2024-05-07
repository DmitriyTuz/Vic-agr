import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  In,
  Like, Not,
  Repository,
  SelectQueryBuilder, UpdateResult
} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import _ from 'underscore';
import * as bcrypt from 'bcryptjs';

import {CustomHttpException} from '@src/exceptions/сustomHttp.exception';
import {CreateUserDto} from '@src/entities/user/dto/create-user.dto';
import {User} from '@src/entities/user/user.entity';
import {HelperService} from '@src/helper/helper.service';
import {Task} from '@src/entities/task/task.entity';
import {Company} from '@src/entities/company/company.entity';
import {ReqQueryGetUsersInterface} from "@src/interfaces/users/reqQuery.get-users.interface";
import {GetFilterCountUsersResponseInterface} from "@src/interfaces/users/get-filterCountUsers-response.interface";
import {UserDataInterface} from "@src/interfaces/users/user-data.interface";
import {PasswordService} from "@src/password/password.service";
import {TwilioService} from "@src/twilio/twilio.service";
import {Tag} from "@src/entities/tag/tag.entity";
import {TagService} from "@src/entities/tag/tag.service";
import {UpdateUserDto} from "@src/entities/user/dto/update-user.dto";
import {Payment} from "@src/entities/payment/payment.entity";
import {UserTypes} from "@lib/constants";
import {PaymentService} from "@src/entities/payment/payment.service";
import {ReqBodyCreateUserDto} from "@src/entities/user/dto/reqBody.create-user.dto";
import {GetWorkerTagsInterface} from "@src/interfaces/tasks/get-worker-tags.interface";
import {GetUsersInterface} from "@src/interfaces/users/get-users-interface";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";


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
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private readonly helperService: HelperService,
    private readonly passwordService: PasswordService,
    private readonly twilioService: TwilioService,
    private readonly tagService: TagService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly paymentService: PaymentService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getAll(reqQuery: GetUsersInterface, currentUserId: number): Promise<{ success: boolean; data: { users: UserDataInterface[], filterCounts: GetFilterCountUsersResponseInterface; } }> {
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

  async getAllUsers(options: GetUsersInterface): Promise<User[]> {
    const query: FindManyOptions<User> = {
      where: {},
      relations: ['tags', 'tasks'],
      order: { id: 'ASC' },
    };

    if (options.companyId) {
      if (!options.ids?.includes('10000')) {
        query.where = { ...(query.where || {}), companyId: options.companyId };
      }
    }

    if (options.ids?.length) {
      let arrIds = [];
      if (Array.isArray(options.ids)) {
        arrIds = options.ids.map(id => +id)
      } else if (typeof (options.ids === 'string')) {
        arrIds = [options.ids]
      }
      query.where = { ...(query.where || {}), id: Not(In(arrIds)) };
    }

    // if (options.ids?.length) {
    //   query.where = { ...(query.where || {}), id: In(options.ids) };
    //   // query.where.id = In(options.ids);
    // }

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

  async create(dto: ReqBodyCreateUserDto, adminId: number): Promise <{ success: boolean, notice: string, data: {user: UserDataInterface}, smsMessage: string }>  {
    try {
      const admin: User = await this.getOneUser({id: adminId});
      const {companyId} = admin;

      dto.companyId = companyId;

      const {tags, ...userDto} = dto;

      const {user, message} = await this.createUser(userDto);
      await this.tagService.checkTagsForUser(user, tags);

      const returnedUser: User = await this.getOneUser({id: user.id, companyId});

      return {
        success: true,
        notice: '200-user-has-been-created-successfully',
        data: {user: this.getUserData(returnedUser)},
        smsMessage: message
      }

    } catch (e) {
      this.logger.error(`Error during user creation by admin: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async createUser(dto: CreateUserDto): Promise <{ user: User, message: string }> {
    try {

      const currentUser: User = await this.userRepository.findOne({ where: { phone: dto.phone } });
      if (currentUser) {
        throw new HttpException(`user-with-phone- ${currentUser.phone} -already-exists`, HttpStatus.FOUND);
      }

      let password: string;

      if (!dto.password) {
        password = this.passwordService.createPassword()

      } else { password = dto.password }

      const hashPassword: string = await this.passwordService.hashPassword(password);
      // const hashPassword: string = await bcrypt.hash(password, 5);

      const newUser: CreateUserDto = {
        ...dto,
        password: hashPassword,
      };

      let user: User = await this.userRepository.save(newUser);

      const message: string = await this.twilioService.sendSMS(dto.phone, password);

      this.logger.log(`User created: ${user.name}`);

      return { user, message }

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

  async getOneUser(findQuery: GetUsersInterface): Promise<User> {
    try {
      // const selectFields: string[] = await this.helperService.getEntityFields(this.userRepository, [], true, false);
      // const selectObject: Record<string, true> = {};
      // // const selectObject: { [key: string]: true } = {};
      //
      // selectFields.forEach((field) => {
      //   selectObject[field] = true;
      // });

      const query: FindOneOptions<User> = {
        where: findQuery,
        relations: ['tags', 'company'],
      };

      return await this.userRepository.findOne(query);
    } catch (e) {
      this.logger.error(`Error during get user: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  // getUserData(user: User): UserDataInterface {
  //   const data: Partial<UserDataInterface> = _.pick(user, ['id', 'name', 'phone', 'type', 'tags', 'tasks', 'hasOnboard', 'companyId', 'company']);
  //   data.tags = data.tags.map((tag: any) => tag.name);
  //
  //   return data as UserDataInterface;
  // }

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

  getUserData(user: User): UserDataInterface {
    const { id, name, phone, type, tags, tasks, hasOnboard, companyId, company } = user;
    const tagNames = tags.map((tag: Tag) => tag.name);

    return {
      id,
      name,
      phone,
      type,
      tags: tagNames,
      tasks,
      hasOnboard,
      companyId,
      company,
    };
  }

  async findByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getWorkers(reqQuery: GetWorkerTagsInterface, currentUserId: number): Promise<{ success: boolean; data: { workers: User[]; } }> {
    try {
      const user: User = await this.getOneUser({ id: currentUserId });

      let { search, ids } = reqQuery;
      const { companyId } = user;

      // if (typeof ids === 'string') {
      //   ids = [ids];
      // }

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

  async getAllWorkers(options: GetWorkerTagsInterface): Promise<User[]> {
    const query: FindManyOptions<User> = {
      select: ['id', 'name'],
      order: { name: 'ASC' },
      where: {},
    };

    if (options.companyId) {
      query.where = { ...(query.where || {}), companyId: options.companyId };
    }

    if (options.ids?.length) {
      let arrIds = [];
      if (Array.isArray(options.ids)) {
        arrIds = options.ids.map(id => +id)
      } else if (typeof (options.ids === 'string')) {
        arrIds = options.ids.split(',')
      }
      query.where = { ...(query.where || {}), id: Not(In(arrIds)) };

    }

    if (options.search) {
      query.where = { ...(query.where || {}), name: Like(`%${options.search}%`) };
    }

    return await this.userRepository.find(query);

    // let query: SelectQueryBuilder<User> = this.userRepository
    //   .createQueryBuilder('user')
    //   .select(['user.id', 'user.name'])
    //   .orderBy('user.name', 'ASC')
    //   .take(10);
    //
    // if (options.companyId) {
    //   query = query.where('user.companyId = :companyId', { companyId: options.companyId });
    // }
    //
    // if (options.ids?.length) {
    //   query = query.andWhere('user.id NOT IN (:...ids)', { ids: options.ids });
    // }
    //
    // if (options.search) {
    //   query = query.andWhere('user.name ILIKE :search', { search: `%${options.search}%` });
    // }
    //
    // const users: User[] = await query.getMany();
    // return users;
  }

  async updateOnboardUser(currentUserId: number): Promise<{ success: boolean; notice: string; userId: number; }>  {
    try {
      const user: User = await this.getOneUser({ id: currentUserId });

      if (!user) {
        throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);
      }

      await this.updateOnboard(user);

      return {
        success: true,
        notice: '200-user-has-been-updated-onboard-successfully',
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

  async update(id: number, dto: ReqBodyUpdateUserDto): Promise <{ success: boolean, notice: string, data: {user: UserDataInterface} }> {
    try {
      const user: User = await this.getOneUser({id: +id});

      if (!user) {
        throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);
      }

      const {tags, ...userDto} = dto;
      await this.updateUser(user, userDto);

      const updatedUser: User = await this.getOneUser({id: +id});

      await this.tagService.checkTagsForUser(updatedUser, tags);

      const returnedUser: User = await this.getOneUser({id: +id});

      return {
        success: true,
        notice: '200-user-has-been-updated-successfully',
        data: {user: this.getUserData(returnedUser)}
      };
    } catch (e) {
      this.logger.error(`Error during update user: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async updateUser(user: User, dto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, dto);
  }

  async remove(id: number): Promise<{success: boolean, notice: string, userId: number}> {
    try {
      const user: User = await this.getOneUser({id});

      if (!user) {
        throw new HttpException(`user-not-found`, HttpStatus.NOT_FOUND);
      }

      if (user.type === UserTypes.ADMIN && user.company.ownerId === user.id && user.company.isSubscribe) {
        const payment = await this.paymentRepository.findOne({select: ['id', 'userId', 'subscriberId', 'customerId'], where: {userId: user.id}});
        if (payment) {
          await this.paymentService.removeSubscribe(payment);
        }
      }

      await this.userRepository.remove(user);

      return {
        success: true,
        notice: '200-user-has-been-removed-successfully',
        userId: id
      };
    } catch (err) {
      throw err;
    }
  }

  async checkUsersForTask(task: Task, userIds: number[]): Promise<void> {
    const existingUsers: User[] = await this.userRepository.find({ where: { id: In(userIds) } });
    const existingUserIds: number[] = existingUsers.map(user => user.id);
    const newUserIds: number[] = userIds.filter(userId => !existingUserIds.includes(userId));

    if (newUserIds[0]) {
      throw new HttpException(`workers-with-this-ids-not-found`, HttpStatus.NOT_FOUND);
    }

    task.workers = [...existingUsers];

    await this.taskRepository.save(task);
  }
}
