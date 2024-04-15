import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { TaskService } from '@src/entities/task/task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/get-tasks')
  @UseGuards(JwtAuthGuard)
  getAll(@Body() reqBody: GetTasksOptionsInterface, @Req() req) {
    return this.taskService.getAll(reqBody, req.user.id);
  }

  // @Post('/api/tasks/create')
  // @UseGuards(JwtAuthGuard)
  // create(@Req() req: Request, @Res() res: Response) {
  //   return this.taskService.create(req, res);
  // }
}
