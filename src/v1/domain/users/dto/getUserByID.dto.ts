import { IsNotEmpty, IsString } from 'class-validator';

export class getUserByIDDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
