import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  passwordOld: string;

  @IsNotEmpty()
  @IsString()
  passwordNew: string;
}
