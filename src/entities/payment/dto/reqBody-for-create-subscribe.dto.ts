import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqBodyForCreateSubscribeDto {

  @ApiProperty({example: 'Free', description: 'Plan type'})
  @IsNotEmpty({message: 'planType required !'})
  @IsString({message: 'Must be a string'})
  readonly planType: string;

  @ApiProperty({example: 'false', description: 'Subscription agreement accepted'})
  @IsNotEmpty({message: 'Agree required !'})
  @IsBoolean({message: 'Must be a boolean'})
  readonly agree: boolean;
}
