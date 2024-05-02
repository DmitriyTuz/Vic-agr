import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsPhone } from '@src/validators/is-phone.validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: '+100000000001', description: 'User phone' })
  @IsNotEmpty({ message: 'Phone required !' })
  @IsString({ message: 'Must be a string' })
  @Validate(IsPhone, { message: 'Phone number is not correct, please type full phone number with country code' })
  readonly phone: string;

}