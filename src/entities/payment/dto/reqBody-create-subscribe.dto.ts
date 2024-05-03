import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqBodyCreateSubscribeDto {

  @ApiProperty({example: 'Monthly', description: 'Plan type'})
  @IsNotEmpty({message: 'PlanType required !'})
  @IsString({message: 'Must be a string'})
  readonly planType: string;

  @ApiProperty({example: 'true', description: 'Subscription agreement accepted'})
  @IsNotEmpty({message: 'Agree required !'})
  @IsBoolean({message: 'Must be a boolean'})
  readonly agree: boolean;
}
