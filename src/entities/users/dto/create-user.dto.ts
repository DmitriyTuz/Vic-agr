import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name required !' })
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16' })
  readonly password: string;

  @IsString({ message: 'Must be a string' })
  readonly phone: string;

  @IsString({ message: 'Must be a string' })
  readonly type: string;

  // readonly companyId: number;
}
