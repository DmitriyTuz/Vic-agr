import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";

import {CustomHttpException} from "@src/exceptions/сustomHttp.exception";
import {CreateUserDto} from "@src/entities/users/dto/create-user.dto";
import {User} from "@src/entities/users/users.entity";

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({where: {id}});
  }

  async findByEmail(email: string): Promise<User>  {
    return await this.userRepository.findOne({where: {email}});
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const currentUser = await this.userRepository.findOne({where: {name: createUserDto.name}});
      if (currentUser) {
        throw new HttpException(`User with name ${currentUser.name} already exists`, HttpStatus.FOUND);
      }

      const userForCreate = this.userRepository.create(createUserDto);

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

}

