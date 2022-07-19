import { IsNotEmpty, IsEmail, IsString, IsDate, Matches, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 8)
  @Matches(/^[A-Za-z][A-Za-z0-9]{3,8}$/, {
    message:
      'Username Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
