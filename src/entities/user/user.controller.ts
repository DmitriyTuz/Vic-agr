import {
  Body,
  Controller, Delete,
  Get,
  HttpException, Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '@src/entities/user/user.service';
import { CreateUserDto } from '@src/entities/user/dto/create-user.dto';
import { User } from '@src/entities/user/user.entity';
import {ApiBearerAuth, ApiExtraModels, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ValidationPipe } from '@src/pipes/validation.pipe';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { ReqQueryGetUsersInterface } from '@src/interfaces/reqQuery.get-users.interface';
import {CheckSuperUserGuard} from "@src/guards/check-super-user.guard";
import {CheckPlanGuard} from "@src/guards/check-plan.guard";
import {ReqBodyCreateUserDto} from "@src/entities/user/dto/reqBody.create-user.dto";
import {ReqQueryGetWorkerTagsInterface} from "@src/interfaces/reqQuery.get-worker-tags.interface";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";

@ApiTags('Users')
@Controller('users')
@ApiExtraModels(CreateUserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-user')
  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: ReqBodyCreateUserDto, @Req() req: RequestWithUser) {
    return await this.userService.create(dto, req.user.id);
  }

  @Get('/get-users')
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiBearerAuth('JWT')
  @ApiQuery({ name: 'search', example: 'U', description: 'Search by part of name', required: false })
  @ApiQuery({ name: 'type', example: 'Worker', description: 'User type', required: false })
  @UseGuards(JwtAuthGuard, CheckPlanGuard)
  // @UseGuards(JwtAuthGuard, CheckSuperUserGuard, CheckPlanGuard)
  getAll(@Query() reqQuery: ReqQueryGetUsersInterface, @Req() req: RequestWithUser) {
    return this.userService.getAll(reqQuery, req.user.id);
  }

  // @Get('get-all-users')
  // async findAll() {
  //   throw new HttpException('Some error', 400);
  //   return this.userService.findAll();
  // }

  @Get('/worker-tags')
  @ApiOperation({ summary: 'Get workers' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiBearerAuth('JWT')
  @ApiQuery({ name: 'search', example: 'U', description: 'Search by part of name', required: false })
  @ApiQuery({ name: 'ids', example: '10001,10002', description: 'Worker ids', required: false })
  @UseGuards(JwtAuthGuard/*, CheckPlanGuard*/)
  async getWorkers(@Query() reqQuery: ReqQueryGetWorkerTagsInterface, @Req() req: RequestWithUser) {
    return this.userService.getWorkers(reqQuery, req.user.id);
  }

  @Patch('/onboard')
  @ApiOperation({ summary: 'User onboard' })
  @ApiResponse({
    status: 200,
    description: 'user-has-been-updated-onboard-successfully'
  })
  // @ApiResponse({ status: 200, type: [User] })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  updateOnboardUser(@Req() req: RequestWithUser) {
    return this.userService.updateOnboardUser(req.user.id);
  }

  @Patch('/update-user/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    description: 'user-has-been-updated-successfully'
  })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'id', example: '10001', description: 'User ID', type: 'number' })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() dto: ReqBodyUpdateUserDto) {
  // update(@Param('id') id: number, @Body() dto: UpdateUserDto & { tags?: string[] }) {
    return this.userService.update(id, dto);
  }

  @Delete('/delete-user/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: 200,
    description: 'user-has-been-removed-successfully'
  })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'id', example: '10001', description: 'User ID', type: 'number' })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
