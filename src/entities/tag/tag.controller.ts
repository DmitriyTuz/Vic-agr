import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TagService } from '@src/entities/tag/tag.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import {User} from "@src/entities/user/user.entity";
import {UserService} from "@src/entities/user/user.service";
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReqQueryGetTagsInterface} from "@src/interfaces/reqQuery.get-tags.interface";
import {Tag} from "@src/entities/tag/tag.entity";

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(
      private tagService: TagService,
      private userService: UserService
      ) {}

  @Get('/get-tags')
  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({ status: 200, description: 'List of tags', type: [Tag] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth('JWT')
  @ApiQuery({ name: 'names', example: 'tag1,tag2', description: 'List of tag names', required: false })
  @ApiQuery({ name: 'search', example: 'search_query', description: 'Search by tag name', required: false })
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() reqQuery: ReqQueryGetTagsInterface, @Req() req: RequestWithUser) {
    const user: User = await this.userService.getOneUser({ id: req.user.id });
    return this.tagService.getAll(reqQuery, user);
  }
}
