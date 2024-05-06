import { ApiProperty } from '@nestjs/swagger';

interface TagsInterface { id: number, name: string }

export class ReqBodyGetTasksDto {

  @ApiProperty({ example: 'All', description: 'Task type' })
  // @IsNotEmpty({ message: 'Type required !' })
  // @IsString({ message: 'Must be a string' })
  readonly type?: string;

  @ApiProperty({ example: [
    {
      "id": 10013,
      "name": "worker"
    }
  ], description: 'Task tags' })
  readonly tags?: TagsInterface[];

  // @ApiProperty({ example: ['tag1', 'tag2'], description: 'Task tags names' })
  // readonly tags?: string[];

  @ApiProperty({ example: 'Active', description: 'Task status' })
  readonly status?: string;

  @ApiProperty({ example: '1714942800000', description: 'Task date' })
  readonly date?: Date;

}