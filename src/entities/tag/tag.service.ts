import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'underscore';

import { TagOptions } from '@src/interfaces/tag-options.interface';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';

import { Tag } from '@src/entities/tag/tag.entity';

import { UserService } from '@src/entities/user/user.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private userService: UserService,
  ) {}

  async getAllTags(tagOptions: TagOptions, req: RequestWithUser) {
    try {
      const user = await this.userService.getOneUser({ id: req.user.id });

      let { names, search } = tagOptions;
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
    } catch (err) {
      throw err;
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
