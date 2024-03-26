import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { TaskService } from '@src/entities/task/task.service';

@Controller()
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/api/tasks')
  @UseGuards(JwtAuthGuard)
  getAll(@Body() reqBody: GetTasksOptionsInterface, @Req() req) {
    return this.taskService.getAll(reqBody, req.user.id);
  }
}
