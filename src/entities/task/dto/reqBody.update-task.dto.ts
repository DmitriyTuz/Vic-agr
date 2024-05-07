import {ApiProperty} from "@nestjs/swagger";
import {UpdateTaskDto} from "@src/entities/task/dto/update-task.dto";

export class ReqBodyUpdateTaskDto extends UpdateTaskDto {
  @ApiProperty({ example: ['tag1', 'tag2'], description: 'Task tags names' })
  readonly tags: string[];

  @ApiProperty({ example: [10001, 10002], description: 'Task workers ids' })
  readonly workers: number[];

  @ApiProperty({ example: [], description: 'Task workers ids' })
  readonly mapLocation;
}