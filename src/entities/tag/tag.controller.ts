import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TagService } from '@src/entities/tag/tag.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { GetTagsOptions } from '@src/interfaces/get-tags-options.interface';

@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('/api/tags')
  @UseGuards(JwtAuthGuard)
  async getAllTags(@Query() reqQuery: GetTagsOptions, @Req() req: RequestWithUser) {
    return this.tagService.getAllTags(reqQuery, req.user.id);
  }
}
