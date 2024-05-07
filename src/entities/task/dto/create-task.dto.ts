import {IsDate, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {ReqBodyCreateTaskDto} from "@src/entities/task/dto/reqBody.create-task.dto";

export class CreateTaskDto extends ReqBodyCreateTaskDto {
  // @ApiProperty({ example: 'Task1', description: 'Task title' })
  // @IsNotEmpty({ message: 'Title required !' })
  // @IsString({ message: 'Must be a string' })
  // readonly title: string;
  //
  // @ApiProperty({ example: 'Low', description: 'Task type' })
  // @IsNotEmpty({ message: 'Type required !' })
  // @IsString({ message: 'Must be a string' })
  // readonly type: string;
  //
  // @ApiProperty({ example: '1', description: 'Task execution time' })
  // @IsNotEmpty({ message: 'executionTime required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  // readonly executionTime: number;
  //
  // @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  // // @IsNotEmpty({ message: 'Type required !' })
  // // @IsString({ message: 'Must be a string' })
  // readonly comment: string;
  //
  // readonly mediaInfo: Record<string, any>[];
  //
  // readonly documentsInfo: Record<string, any>[];

  // @ApiProperty({ example: '1', description: 'CompanyId' })
  // @IsNotEmpty({ message: 'CompanyId required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  companyId?: number;

  // @ApiProperty({ example: '', description: 'Task due date' })
  // @IsNotEmpty({ message: 'dueDate required !' })
  // @IsDate({ message: 'Must be a date' })
  // readonly dueDate: Date;

  userId?: number;

}
