import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {ReqBodyReportTaskDto} from "@src/entities/report-task/dto/reqBody.report-task.dto";

export class ReportTask_createDto extends ReqBodyReportTaskDto {

  @ApiProperty({ example: '10001', description: 'User id' })
  @IsNotEmpty({ message: 'userId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  userId: number;

  @ApiProperty({ example: '10001', description: 'Task id' })
  @IsNotEmpty({ message: 'taskId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  taskId: number;

}