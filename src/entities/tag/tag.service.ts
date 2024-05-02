import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {EntityManager, FindManyOptions, In, Like, Not, Repository} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';

import _ from 'underscore';

import { GetTagsInterface } from '@src/interfaces/get-tags.interface';

import { Tag } from '@src/entities/tag/tag.entity';

import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import {User} from "@src/entities/user/user.entity";
import {Task} from "@src/entities/task/task.entity";


@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private userService: UserService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async getAll(reqQuery: GetTagsInterface, user: User): Promise<{ success: boolean; data: { tags: Tag[]; } }> {
    try {
      // const user: User = await this.userService.getOneUser({ id: currentUserId });

      let { names, search } = reqQuery;
      const { companyId } = user;

      const tags: Tag[] = await this.getAllTags({names, action: 'GetAll', search, companyId});
      const returnedTags: Tag[] = [];

      for (const t of tags) {
        returnedTags.push(await this.getTagData(t));
      }

      const response = {
        success: true,
        data: { tags }
        // data: { tags: returnedTags },
      };

      return response;
    } catch (e) {
      this.logger.error(`Error during get all tags: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllTags(options: GetTagsInterface): Promise<Tag[]> {
    const query: FindManyOptions<Tag> = {
      select: ['id', 'name'],
      order: { name: 'ASC' },
      where: {},
    };

    if (options.companyId) {
      query.where = { ...(query.where || {}), companyId: options.companyId };
    }

    if (options.action === 'GetAll') {
      if (options.names?.length) {
        let arrNames = [];
        if (Array.isArray(options.names)) {
          arrNames = options.names.map((name) => name.toLowerCase());
        } else if (typeof options.names === 'string') {
          arrNames = options.names.split(',').map((name) => name.toLowerCase());
        }
        query.where = { ...(query.where || {}), name: Not(In(arrNames)) };
      }

      query.take = 10;
    }

    if (options.search) {
      query.where = { ...(query.where || {}), name: Like(`%${options.search}%`) };
    }

    return await this.tagRepository.find(query);
  }

  async getTagData(tag) {
    const data = _.pick(tag, ['id', 'name']);
    data.name = this.capitalize(data.name);
    return data;
  }

  private capitalize(s: string, camelCase: boolean = false) {
    if (typeof s === 'string') {
      let result = s.charAt(0).toUpperCase();
      if (camelCase) {
        result = result + s.slice(1).toLowerCase();
      } else {
        result = result + s.slice(1);
      }
      return result;
    } else {
      return '';
    }
  }

  async checkTagsForUser(user: User, tagNames: string[]): Promise<void> {
    try {
      await this.checkTags(user, tagNames)
      await this.userRepository.save(user);

    } catch (e) {
      this.logger.error(`Error while checking tags: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async checkTagsForTask(task: Task, tagNames: string[]): Promise<void> {
    try {
      await this.checkTags(task, tagNames)
      await this.taskRepository.save(task);

    } catch (e) {
      this.logger.error(`Error while checking tags for tasks: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async checkTags(entity: any, tagNames: string[]): Promise<void> {
    const existingTags: Tag[] = await this.tagRepository.find({ where: { name: In(tagNames), companyId: entity.companyId } });
    const existingTagNames: string[] = existingTags.map(tag => tag.name);
    const newTagNames: string[] = tagNames.filter(tagName => !existingTagNames.includes(tagName));
    const newTags: Tag[] = newTagNames.map(tagName => this.tagRepository.create({ name: tagName, companyId: entity.companyId }));

    if (newTags.length > 0) {
      await this.tagRepository.save(newTags);
    }

    entity.tags = [...existingTags, ...newTags];
  }
}
