import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsPhone } from '@src/validators/is-phone.validator';

export class SignUpDto {
  @ApiProperty({ example: '+100000000001', description: 'User phone' })
  @IsNotEmpty({ message: 'Phone required !' })
  @IsString({ message: 'Must be a string' })
  @Validate(IsPhone, { message: 'Phone number is not correct, please type full phone number with country code' })
  readonly phone: string;

  @ApiProperty({ example: '1234567', description: 'User password' })
  @IsNotEmpty({ message: 'Password required !' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16' })
  readonly password: string;

  @ApiProperty({ example: 'User1', description: 'User name' })
  @IsNotEmpty({ message: 'User name required !' })
  @IsString({ message: 'Must be a string' })
  @Length(3, 256, { message: 'Must be at least 2 characters' })
  readonly name: string;

  @ApiProperty({ example: 'Company1', description: 'Company name' })
  @IsNotEmpty({ message: 'Company name required !' })
  @IsString({ message: 'Must be a string' })
  readonly companyName: string;

  // @ApiProperty({ example: '1234567', description: 'User password' })
  readonly passwordConfirmation: string;

  @ApiProperty({ example: 'logo1', description: 'Logo' })
  readonly logo: Record<string, any>;

}