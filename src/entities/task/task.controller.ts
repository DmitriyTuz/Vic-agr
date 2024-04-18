import {Body, Controller, Param, Patch, Post, Put, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { TaskService } from '@src/entities/task/task.service';
import {RequestWithUser} from "@src/interfaces/add-field-user-to-Request.interface";
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {ReqBodyTaskDto} from "@src/entities/task/dto/reqBody.task.dto";
import {ReqBodyUpdateTaskDto} from "@src/entities/task/dto/reqBody.update-task.dto";
import {ReqBodyCompleteTaskDto} from "@src/entities/complete-task/dto/reqBody.complete-task.dto";
import {ReqBodyReportTaskDto} from "@src/entities/report-task/dto/reqBody.report-task.dto";

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/get-tasks')
  @UseGuards(JwtAuthGuard)
  getAll(@Body() reqBody: GetTasksOptionsInterface, @Req() req) {
    return this.taskService.getAll(reqBody, req.user.id);
  }

  @Post('/create-task')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  create(@Body() reqBody: ReqBodyTaskDto, @Req() req: RequestWithUser) {
    return this.taskService.create(reqBody, req.user.id);
  }

  @Patch('/:id/update-task')
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
