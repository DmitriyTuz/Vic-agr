import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhone } from '@src/validators/is-phone.validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'User1', description: 'User name for update' })
  // @IsNotEmpty({ message: 'Name required !' })
  // @IsString({ message: 'Must be a string' })
  readonly name?: string;

  @ApiProperty({ example: '+100000000001', description: 'Phone' })
  // @IsNotEmpty({ message: 'Phone required !' })
  // @IsString({ message: 'Must be a string' })
  @Validate(IsPhone, { message: 'Phone number is not correct, please type full phone number with country code' })
  readonly phone?: string;

  @ApiProperty({ example: 'WORKER', description: 'Role' })
  // @IsNotEmpty({ message: 'Type required !' })
  // @IsString({ message: 'Must be a string' })
  readonly type?: string;

  readonly password?: string;

  // @ApiProperty({ example: ['tag1', 'tag2'], description: 'User tags' })
  // readonly tags?: string[];
}