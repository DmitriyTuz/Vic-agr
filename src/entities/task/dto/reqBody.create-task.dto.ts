import {IsDate, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqBodyCreateTaskDto {
  @ApiProperty({ example: 'Task1', description: 'Task title' })
  @IsNotEmpty({ message: 'Title required !' })
  @IsString({ message: 'Must be a string' })
  readonly title: string;

  @ApiProperty({ example: 'Low', description: 'Task type' })
  @IsNotEmpty({ message: 'Type required !' })
  @IsString({ message: 'Must be a string' })
  readonly type: string;

  @ApiProperty({ example: '1', description: 'Task execution time' })
  @IsNotEmpty({ message: 'executionTime required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly executionTime: number;

  @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  // @IsNotEmpty({ message: 'Type required !' })
  // @IsString({ message: 'Must be a string' })
  readonly comment: string;

  readonly mediaInfo?: Record<string, any>[];

  readonly documentsInfo?: Record<string, any>[];

  @ApiProperty({ example: '2024-04-17', description: 'Task due date' })
  @IsNotEmpty({ message: 'DueDate required !' })
  @IsString({ message: 'Must be a string' })
  // @IsDate({ message: 'Must be a date' })
  readonly dueDate: Date;

  @ApiProperty({ example: ['tag1', 'tag2'], description: 'Task tags names' })
  readonly tags: string[];

  @ApiProperty({ example: [10001, 10002], description: 'Task workers ids' })
  readonly workers: number[];

  @ApiProperty({ example: [], description: 'Task location ids' })
  readonly mapLocation;

}