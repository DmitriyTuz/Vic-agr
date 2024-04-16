import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { TaskService } from '@src/entities/task/task.service';
import {RequestWithUser} from "@src/interfaces/add-field-user-to-Request.interface";

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/get-tasks')
  @UseGuards(JwtAuthGuard)
  getAll(@Body() reqBody: GetTasksOptionsInterface, @Req() req) {
    return this.taskService.getAll(reqBody, req.user.id);
  }

  @Post('/create-task')
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser) {
    return this.taskService.create(req);
  }

  // @Post('/create')
  // @UseGuards(JwtAuthGuard)
  // create(@Req() req: RequestWithUser) {
  //   return this.taskService.create(req);
  // }

}
