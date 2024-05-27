import {IsBoolean, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqBodyCreatePaymentDto {
  @ApiProperty({ example: 'false', description: 'Subscription agreement accepted' })
  @IsNotEmpty({ message: 'Agree required !' })
  @IsBoolean({ message: 'Must be a boolean' })
  readonly agree: boolean;

  @ApiProperty({ example: 'Visa', description: 'Card type' })
  @IsNotEmpty({ message: 'CardType required !' })
  @IsString({ message: 'Must be a string' })
  readonly cardType: string;

  @ApiProperty({ example: 7, description: 'Subscribe exp month' })
  @IsNotEmpty({ message: 'Exp_month required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly exp_month: number;

  @ApiProperty({ example: 2024, description: 'Subscribe exp year' })
  @IsNotEmpty({ message: 'Exp_year required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly exp_year: number;

  readonly nameOnCard?: string;

  @ApiProperty({ example: '4242', description: 'Subscribe number' })
  @IsNotEmpty({ message: 'Number required !' })
  @IsString({ message: 'Must be a string' })
  readonly number: string;

  @ApiProperty({ example: 'tok_1PCQVBC581Db3P9C1cJqkE0r', description: 'Subscribe token' })
  @IsNotEmpty({ message: 'Token required !' })
  @IsString({ message: 'Must be a string' })
  readonly token: string;

  expiration?: string;
}