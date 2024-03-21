import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TagService } from '@src/entities/tag/tag.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { TagOptions } from '@src/interfaces/tag-options.interface';

@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('/api/tags')
  @UseGuards(JwtAuthGuard)
  async getAllTags(@Query() tagOptions: TagOptions, @Req() req: RequestWithUser) {
    return this.tagService.getAllTags(tagOptions, req);
  }
}
