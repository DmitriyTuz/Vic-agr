import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class ReqBodyCompleteTaskDto {

  @ApiProperty({ example: '1', description: 'Time log' })
  // @IsNotEmpty({ message: 'Time log required !' })
  // @IsString({ message: 'Must be a string' })
  timeLog: string;

  @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  // @IsNotEmpty({ message: 'Comment log required !' })
  // @IsString({ message: 'Must be a string' })
  comment: string;

  @ApiProperty({ type: 'file', example: [{"url": "https://test-my-uploads1.s3.eu-north-1.amazonaws.com/1715156951709-1.jpeg", "size": 131748, "type": "image/jpeg", "progress": 100, "thumbUrl": ""}], description: 'Media files' })
  mediaInfo?: Record<string, any>[];

  // @ApiProperty({ type: 'string', format: 'binary', description: 'Media files' })
  // mediaInfo: Record<string, any>[];

  // @ApiProperty({ type: 'string', format: 'binary', description: 'Media files' })
  // mediaInfo: FileUpload[];

  // @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  // mediaInfo: Record<string, any>[];
}