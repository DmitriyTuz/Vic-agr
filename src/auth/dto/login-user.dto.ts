import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsPhone } from '@src/validators/is-phone.validator';

export class LoginUserDto {
  @ApiProperty({ example: '+100000000001', description: 'Phone' })
  @IsNotEmpty({ message: 'Phone required !' })
  @IsString({ message: 'Must be a string' })
  @Validate(IsPhone, { message: 'Phone number is not correct, please type full phone number with country code' })
  readonly phone: string;

  @ApiProperty({ example: '1234567', description: 'Password' })
  @IsNotEmpty({ message: 'Password required !' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16' })
  readonly password: string;
}
