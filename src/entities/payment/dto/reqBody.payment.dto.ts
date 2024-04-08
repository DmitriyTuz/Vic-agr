import {IsBoolean, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqBodyPaymentDto {
  @ApiProperty({ example: 'false', description: 'Subscription agreement accepted' })
  @IsNotEmpty({ message: 'Agree required !' })
  @IsBoolean({ message: 'Must be a boolean' })
  readonly agree: boolean;

  @ApiProperty({ example: 'Visa', description: 'Card type' })
  @IsNotEmpty({ message: 'cardType required !' })
  @IsString({ message: 'Must be a string' })
  readonly cardType: string;

  @IsNotEmpty({ message: 'exp_month required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly exp_month: number;

  @IsNotEmpty({ message: 'exp_year required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly exp_year: number;

  readonly nameOnCard: string;

  @IsNotEmpty({ message: 'number required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly number: string;

  @IsNotEmpty({ message: 'cardType required !' })
  @IsString({ message: 'Must be a string' })
  readonly token: string;

  expiration?: string;

}