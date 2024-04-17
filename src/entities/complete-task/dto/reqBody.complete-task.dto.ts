import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class ReqBodyCompleteTaskDto {

  @ApiProperty({ example: '1', description: 'Time log' })
  // @IsNotEmpty({ message: 'Time log required !' })
  // @IsString({ message: 'Must be a string' })
  timeLog: string;

  @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  comment: string;

  mediaInfo: Record<string, any>[];
}