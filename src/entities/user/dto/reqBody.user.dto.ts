import {CreateUserDto} from "@src/entities/user/dto/create-user.dto";
import {ApiProperty} from "@nestjs/swagger";

export class ReqBodyUserDto extends CreateUserDto {
  @ApiProperty({ example: ['tag1', 'tag2'], description: 'User tags' })
  readonly tags: string[];
}