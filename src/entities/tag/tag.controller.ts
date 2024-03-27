import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TagService } from '@src/entities/tag/tag.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { GetTagsOptionsInterface } from '@src/interfaces/get-tags-options.interface';

@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('/api/tags')
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() reqQuery: GetTagsOptionsInterface, @Req() req: RequestWithUser) {
    return this.tagService.getAll(reqQuery, req.user.id);
  }
}
