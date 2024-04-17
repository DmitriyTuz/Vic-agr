import {ReqBodyCompleteTaskDto} from "@src/entities/complete-task/dto/reqBody.complete-task.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class CompleteTask_createDto extends ReqBodyCompleteTaskDto {

  @ApiProperty({ example: '10001', description: 'User id' })
  @IsNotEmpty({ message: 'userId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  userId: number;

  @ApiProperty({ example: '10001', description: 'Task id' })
  @IsNotEmpty({ message: 'taskId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  taskId: number;

}
