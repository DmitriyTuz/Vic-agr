import { IsNotEmpty, IsNumber, IsString, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhone } from '@src/validators/is-phone.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'User 1', description: 'User name for create' })
  @IsNotEmpty({ message: 'Name required !' })
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @ApiProperty({ example: '1234567', description: 'Password' })
  // @IsNotEmpty({ message: 'Password required !' })
  // @IsString({ message: 'Must be a string' })
  // @Length(4, 16, { message: 'Must be between 4 and 16' })
  readonly password: string;

  @ApiProperty({ example: '+100000000001', description: 'Phone' })
  @IsNotEmpty({ message: 'Phone required !' })
  @IsString({ message: 'Must be a string' })
  @Validate(IsPhone, { message: 'Phone number is not correct, please type full phone number with country code' })
  readonly phone: string;

  @ApiProperty({ example: 'WORKER', description: 'Role' })
  @IsNotEmpty({ message: 'Type required !' })
  @IsString({ message: 'Must be a string' })
  readonly type: string;

  @ApiProperty({ example: 10003, description: "Company ID" })
  // @IsNotEmpty({ message: 'CompanyId required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  companyId: number;
}
