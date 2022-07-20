import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsDate, Matches, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Nguyen Ha Anh Kiem',
    description: 'The name of the User',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @ApiProperty({
    example: 'Anhm0@',
    description: 'The username of the User',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{3,8})/, {
    message:
      'Username Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
  })
  username: string;

  @ApiProperty({
    example: 'satthuid@gmail.com',
    description: 'The email of the User',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Anhkiem0701@.',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '2022-07-18T07:21:30.000Z',
    description: 'The birthday of the User',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
