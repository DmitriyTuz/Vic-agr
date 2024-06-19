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
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ValidationPipe } from '@src/pipes/validation.pipe';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/users/add-field-user-to-Request.interface';
import { ReqQueryGetUsersInterface } from '@src/interfaces/users/reqQuery.get-users.interface';
import {CheckSuperUserGuard} from "@src/guards/check-super-user.guard";
import {CheckPlanGuard} from "@src/guards/check-plan.guard";
import {ReqBodyCreateUserDto} from "@src/entities/user/dto/reqBody.create-user.dto";
import {ReqQueryGetWorkerTagsInterface} from "@src/interfaces/tasks/reqQuery.get-worker-tags.interface";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";
import {UserProducerService} from "@src/entities/user/user.producer.service";

@ApiTags('Users')
@Controller('users')
@ApiExtraModels(CreateUserDto)
export class UserController {
  constructor(private userService: UserService,
              private userProducerService: UserProducerService) {}

  @Post('/create-user')
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: ReqBodyCreateUserDto, description: 'User data' })
  @ApiResponse({ status: 200, type: User, description: 'User has been created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: ReqBodyCreateUserDto, @Req() req: RequestWithUser) {
    return this.userService.create(dto, req.user.id);
  }

  @Get('/account')
  @ApiOperation({ summary: 'Get user account' })
  @ApiResponse({ status: 200, type: User, description: 'User account data' })
  @ApiResponse({ status: 400, description: 'Invalid user account data' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  getOne(@Req() req: RequestWithUser) {
    return this.userService.getOne(req.user.id);
  }

  @Get('/get-users')
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: [User], description: 'List of users' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiBearerAuth('JWT')
  @ApiQuery({ name: 'search', example: 'U', description: 'Search by part of name', required: false })
  @ApiQuery({ name: 'type', example: 'Worker', description: 'User type', required: false })
  @UseGuards(JwtAuthGuard, CheckPlanGuard)
  // @UseGuards(JwtAuthGuard, CheckSuperUserGuard, CheckPlanGuard)
  getAll(@Query() reqQuery: ReqQueryGetUsersInterface, @Req() req: RequestWithUser) {
    return this.userService.getAll(reqQuery, req.user.id);
  }

  @Get('/worker-tags')
  @ApiOperation({ summary: 'Get workers' })
  @ApiResponse({ status: 200, type: [User], description: 'List of workers' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiBearerAuth('JWT')
  @ApiQuery({ name: 'search', example: 'U', description: 'Search by part of name', required: false })
  // @ApiQuery({ name: 'ids', example: 'tag1, tag2', description: 'Worker ids', required: false })
  @ApiQuery({ name: 'ids', example: '10001,10002', description: 'Worker ids', required: false })
  @UseGuards(JwtAuthGuard/*, CheckPlanGuard*/)
  getWorkers(@Query() reqQuery: ReqQueryGetWorkerTagsInterface, @Req() req: RequestWithUser) {
    return this.userService.getWorkers(reqQuery, req.user.id);
  }

  @Patch('/onboard')
  @ApiOperation({ summary: 'User onboard' })
  @ApiResponse({status: 200, description: 'User has been successfully onboarded'})
  @ApiResponse({ status: 400, description: 'Invalid user id' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  updateOnboardUser(@Req() req: RequestWithUser) {
    return this.userService.updateOnboardUser(req.user.id);
  }

  @Patch('/update-user/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({status: 200, description: 'User has been updated successfully'})
  @ApiResponse({ status: 400, description: 'Invalid user id or request body' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'id', example: '10001', description: 'User ID', type: 'number' })
  @ApiBody({ type: ReqBodyUpdateUserDto, description: 'User data' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  update(@Param('id') id: number, @Body() dto: ReqBodyUpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('/delete-user/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User has been removed successfully'})
  @ApiResponse({ status: 400, description: 'Invalid user id' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'id', example: '10001', description: 'User ID', type: 'number' })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Get('/find-user-queue')
  async findUser(@Query('userId') userId: number) {
    await this.userProducerService.findUserDB(userId)
    return userId;
  }
}
