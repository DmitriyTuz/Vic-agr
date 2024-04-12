import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCompanyDto {
  @ApiProperty({ example: 'Company1', description: 'Company name' })
  @IsNotEmpty({ message: 'Name required !' })
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  readonly logo: Record<string, any>;

}