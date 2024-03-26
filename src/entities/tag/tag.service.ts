import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'underscore';

import { GetTagsOptions } from '@src/interfaces/get-tags-options.interface';

import { Tag } from '@src/entities/tag/tag.entity';

import { UserService } from '@src/entities/user/user.service';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private userService: UserService,
  ) {}

  async getAllTags(reqQuery: GetTagsOptions, currentUserId) {
    try {
      const user = await this.userService.getOneUser({ id: currentUserId });

      let { names, search } = reqQuery;
      const { companyId } = user;

      if (Array.isArray(names)) {
        names = names.map((name) => name.toLowerCase());
      } else if (typeof names === 'string') {
        names = [names.toLowerCase()];
      }

      const query: any = {
        select: ['id', 'name'],
        order: { name: 'ASC' },
        where: {},
      };

      if (companyId) {
        query.where.companyId = companyId;
      }

      query.take = 10;
      query.where.name = names && names.length > 0 ? { $notIn: names } : {};
      query.where.name = { $like: `%${search}%` };

      let tags = await this.tagRepository.find(query);
      const returnedTags = [];

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
