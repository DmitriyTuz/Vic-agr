import {IsBoolean, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'false', description: 'Subscription agreement accepted' })
  // @IsNotEmpty({ message: 'Agree required !' })
  // @IsBoolean({ message: 'Must be a boolean' })
  readonly agree: boolean;

  @IsNotEmpty({ message: 'cardType required !' })
  @IsString({ message: 'Must be a string' })
  readonly cardType: string;

  // @IsNotEmpty({ message: 'exp_month required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  // readonly exp_month: number;
  //
  // @IsNotEmpty({ message: 'exp_year required !' })
  // @IsNumber({}, { message: 'Must be a number' })
  // readonly exp_year: number;

  @IsNotEmpty({ message: 'number required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly number: string;

  // @IsNotEmpty({ message: 'cardType required !' })
  // @IsString({ message: 'Must be a string' })
  // readonly token: string;

  readonly nameOnCard: string;

  @IsNotEmpty({ message: 'userId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly userId: number;

  @IsNotEmpty({ message: 'expiration required !' })
  @IsString({ message: 'Must be a string' })
  expiration: string;

  @IsNotEmpty({ message: 'customerId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly customerId: string;

  @IsNotEmpty({ message: 'type required !' })
  @IsString({ message: 'Must be a string' })
  readonly type: string;

  readonly token?: string;

  readonly exp_month?: string;

  readonly exp_year?: string;

}