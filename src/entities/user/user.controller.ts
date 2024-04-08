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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '@src/pipes/validation.pipe';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { GetUsersOptionsInterface } from '@src/interfaces/get-users-options.interface';
import {UpdateUserDto} from "@src/entities/user/dto/update-user.dto";

@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-user')
  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({ status: 200, type: User })
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateUserDto & { tags?: string[] }, @Req() req: RequestWithUser) {
    return await this.userService.create(dto, req.user.id);
  }

  @Get('/get-users')
  @UseGuards(JwtAuthGuard)
  getAll(@Query() reqQuery: GetUsersOptionsInterface, @Req() req: RequestWithUser) {
    return this.userService.getAll(reqQuery, req.user.id);
  }

  @Get('get-all-users')
  async findAll() {
    throw new HttpException('Some error', 400);
    return this.userService.findAll();
  }

  @Get('/worker-tags')
  @UseGuards(JwtAuthGuard)
  async getWorkers(@Query() workerOptions: GetUsersOptionsInterface, @Req() req: RequestWithUser) {
    return this.userService.getWorkers(workerOptions, req.user.id);
  }

  @Patch('/onboard')
  @UseGuards(JwtAuthGuard)
  updateOnboardUser(@Req() req: RequestWithUser) {
    return this.userService.updateOnboardUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-user/:id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto & { tags?: string[] }) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-user/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
