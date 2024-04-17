import {Body, Controller, Param, Patch, Post, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { TaskService } from '@src/entities/task/task.service';
import {RequestWithUser} from "@src/interfaces/add-field-user-to-Request.interface";
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {ReqBodyTaskDto} from "@src/entities/task/dto/reqBody.task.dto";
import {ReqBodyUpdateTaskDto} from "@src/entities/task/dto/reqBody.update-task.dto";

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
  @UseGuards(JwtAuthGuard)
  update(@Body() reqBody: ReqBodyUpdateTaskDto, @Req() req: RequestWithUser, @Param('id') id: number) {
    return this.taskService.update(reqBody, req.user.id, id);
  }

}
