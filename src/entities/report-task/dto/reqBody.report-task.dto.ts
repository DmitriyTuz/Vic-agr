import {ApiProperty} from "@nestjs/swagger";

export class ReqBodyReportTaskDto {

  @ApiProperty({ example: 'Comment1', description: 'Any comment' })
  comment: string;

  mediaInfo: Record<string, any>[];
}