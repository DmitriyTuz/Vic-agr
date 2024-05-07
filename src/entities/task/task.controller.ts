import {Body, Controller, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
// import { GetTasksInterface } from '@src/interfaces/tasks/get-tasks.interface';
import { TaskService } from '@src/entities/task/task.service';
import {RequestWithUser} from "@src/interfaces/users/add-field-user-to-Request.interface";
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {ReqBodyCreateTaskDto} from "@src/entities/task/dto/reqBody.create-task.dto";
import {ReqBodyUpdateTaskDto} from "@src/entities/task/dto/reqBody.update-task.dto";
import {ReqBodyCompleteTaskDto} from "@src/entities/complete-task/dto/reqBody.complete-task.dto";
import {ReqBodyReportTaskDto} from "@src/entities/report-task/dto/reqBody.report-task.dto";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
// import {ReqQueryGetTasksInterface} from "@src/interfaces/tasks/reqQuery.get-tasks.interface";
import {Task} from "@src/entities/task/task.entity";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";
import {ReqBodyGetTasksDto} from "@src/entities/task/dto/reqBody.get-tasks.dto";

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // @Get('/get-tasks')
  // @ApiOperation({ summary: 'Get tasks' })
  // @ApiResponse({ status: 200,/* type: [Task],*/ description: 'List of tasks' })
  // @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  // @ApiQuery({ name: 'date', type: Date, description: 'Date of the tasks', required: false })
  // @ApiQuery({ name: 'status', type: String, description: 'Status of the tasks', required: false })
  // @ApiQuery({ name: 'type', type: String, description: 'Type of the tasks', required: false })
  // @ApiQuery({ name: 'tags', schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' } } } }, description: 'Array of tag objects', required: false })
  //
  // // @ApiQuery({ name: 'tags', type: [{ id: 'number', name: 'string' }], description: 'Array of tag objects', required: false })
  // @ApiBearerAuth('JWT')
  // @UseGuards(JwtAuthGuard)
  // getAll(@Query() reqQuery: ReqQueryGetTasksInterface, @Req() req) {
  //   return this.taskService.getAll(reqQuery, req.user.id);
  // }

  @Post('/get-tasks')
  @ApiOperation({ summary: 'Get tasks' })
  @ApiBody({ type: ReqBodyGetTasksDto, description: 'User data' })
  @ApiResponse({ status: 200,/* type: [Task],*/ description: 'List of tasks' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @UseGuards(JwtAuthGuard)
  getAll(@Body() reqBody: ReqBodyGetTasksDto, @Req() req) {
    return this.taskService.getAll(reqBody, req.user.id);
  }

  @Post('/create-task')
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: ReqBodyCreateTaskDto, description: 'Task data' })
  @ApiResponse({ status: 200,/* type: Task,*/ description: 'Task has been created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid task data' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  create(@Body() reqBody: ReqBodyCreateTaskDto, @Req() req: RequestWithUser) {
    return this.taskService.create(reqBody, req.user.id);
  }

  @Patch('/:id/update-task')
  @ApiOperation({ summary: 'Update task by ID' })
  @ApiBody({ type: ReqBodyUpdateTaskDto, description: 'Task data' })
  @ApiResponse({ status: 200,/* type: Task,*/ description: 'Task has been updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid task id or request body' })
  @ApiParam({ name: 'id', example: '10001', description: 'Task ID', type: 'number' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  update(@Body() reqBody: ReqBodyUpdateTaskDto, @Req() req: RequestWithUser, @Param('id') taskId: number) {
    return this.taskService.update(reqBody, req.user.id, taskId);
  }

  @Put('/:id/complete-task')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  complete(@Body() reqBody: ReqBodyCompleteTaskDto, @Req() req: RequestWithUser, @Param('id') taskId: number) {
    return this.taskService.complete(reqBody, req.user.id, taskId);
  }

  @Put('/:id/report-task')
  @UseGuards(JwtAuthGuard)
  report(@Body() reqBody: ReqBodyReportTaskDto, @Req() req: RequestWithUser, @Param('id') taskId: number) {
    return this.taskService.report(reqBody, req.user.id, taskId);
  }
}
