import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TagService } from '@src/entities/tag/tag.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { GetTagsOptionsInterface } from '@src/interfaces/get-tags-options.interface';
import {User} from "@src/entities/user/user.entity";
import {UserService} from "@src/entities/user/user.service";

@Controller('tags')
export class TagController {
  constructor(
      private tagService: TagService,
      private userService: UserService
      ) {}

  // @Get('/api/tags')
  // @UseGuards(JwtAuthGuard)
  // async getAll(@Query() reqQuery: GetTagsOptionsInterface, @Req() req: RequestWithUser) {
  //   return this.tagService.getAll(reqQuery, req.user.id);
  // }

  @Get('/get-tags')
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() reqQuery: GetTagsOptionsInterface, @Req() req: RequestWithUser) {
    const user: User = await this.userService.getOneUser({ id: req.user.id });
    return this.tagService.getAll(reqQuery, user);
  }
}
