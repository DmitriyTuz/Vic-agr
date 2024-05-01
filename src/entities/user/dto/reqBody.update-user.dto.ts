import {ApiProperty} from "@nestjs/swagger";
import {UpdateUserDto} from "@src/entities/user/dto/update-user.dto";

export class ReqBodyUpdateUserDto extends UpdateUserDto {
  @ApiProperty({ example: ['tag1', 'tag2'], description: 'Task tags names' })
  readonly tags?: string[];
}