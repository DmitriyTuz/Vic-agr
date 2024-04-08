import {IsBoolean, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'userId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly userId: number;

  @IsNotEmpty({ message: 'number required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly number: string;

  @ApiProperty({ example: 'Visa', description: 'Card type' })
  @IsNotEmpty({ message: 'cardType required !' })
  @IsString({ message: 'Must be a string' })
  readonly cardType: string;

  readonly nameOnCard: string;

  @IsNotEmpty({ message: 'expiration required !' })
  @IsString({ message: 'Must be a string' })
  expiration: string;

  @IsNotEmpty({ message: 'customerId required !' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly customerId: string;

  @IsNotEmpty({ message: 'type required !' })
  @IsString({ message: 'Must be a string' })
  readonly type: string;

  @IsNotEmpty({ message: 'Agree required !' })
  @IsBoolean({ message: 'Must be a boolean' })
  readonly agree: boolean;

}