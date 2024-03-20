import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import _ from 'underscore';
import * as bcrypt from 'bcryptjs';

import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { CreateUserDto } from '@src/entities/user/dto/create-user.dto';
import { User } from '@src/entities/user/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

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

  async getOneUser(findQuery): Promise<User> {
    return await this.userRepository.findOne({
      where: findQuery,
      relations: ['tags', 'company'],
    });
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
}
