import {IsNotEmpty, IsNumber, IsString, Length} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

  @ApiProperty({ example: "User1", description: "User name for create" })
  @IsNotEmpty({ message: 'Name required !' })
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @ApiProperty({ example: "1234567", description: "Password" })
  @IsNotEmpty({ message: 'Password required !' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16' })
  readonly password: string;

  @ApiProperty({example: '+100000000001', description: "Phone"})
  @IsNotEmpty({ message: 'Phone required !' })
  @IsString({ message: 'Must be a string' })
  readonly phone: string;

  @ApiProperty({example: 'WORKER', description: "Role"})
  @IsNotEmpty({ message: 'Type required !' })
  @IsString({ message: 'Must be a string' })
  readonly type: string;

  // @ApiProperty({ example: 1, description: "Company ID" })
  // @IsNotEmpty({ message: 'CompanyId required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  // readonly companyId: number;
}