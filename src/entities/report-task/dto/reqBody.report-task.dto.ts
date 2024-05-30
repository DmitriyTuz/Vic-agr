import {ApiProperty} from "@nestjs/swagger";

export class ReqBodyReportTaskDto {

  @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  comment: string;

  @ApiProperty({ type: 'file', example: [{"url": "https://test-my-uploads1.s3.eu-north-1.amazonaws.com/1715156951709-1.jpeg", "size": 131748, "type": "image/jpeg", "progress": 100, "thumbUrl": ""}], description: 'Media files' })
  mediaInfo?: Record<string, any>[];
}