import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {FindManyOptions, In, Like, Not, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'underscore';

import { GetTagsOptionsInterface } from '@src/interfaces/get-tags-options.interface';

import { Tag } from '@src/entities/tag/tag.entity';

import { UserService } from '@src/entities/user/user.service';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import {User} from "@src/entities/user/user.entity";

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private userService: UserService,
  ) {}

  async getAll(reqQuery: GetTagsOptionsInterface, currentUserId: number): Promise<{ success: boolean; data: { tags: Tag[]; } }> {
    try {
      const user: User = await this.userService.getOneUser({ id: currentUserId });

      let { names, search } = reqQuery;
      const { companyId } = user;

      const tags: Tag[] = await this.getAllTags({names, action: 'GetAll', search, companyId});
      const returnedTags: Tag[] = [];

      for (const t of tags) {
        returnedTags.push(await this.getTagData(t));
      }

      const response = {
        success: true,
        data: { tags: returnedTags },
      };

      return response;
    } catch (e) {
      this.logger.error(`Error during get all tags: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllTags(options: GetTagsOptionsInterface): Promise<Tag[]> {
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

        if (Array.isArray(options.names)) {
          options.names = options.names.map((name) => name.toLowerCase());
        } else if (typeof options.names === 'string') {
          options.names = [options.names.toLowerCase()];
        }
        query.where = { ...(query.where || {}), name: Not(In(options.names)) };
        query.where = { ...(query.where || {}), name: Like(`%${options.search}%`) };
      }

      query.take = 10;
    }

    return this.tagRepository.find(query);
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

}
