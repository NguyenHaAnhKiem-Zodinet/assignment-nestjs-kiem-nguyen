import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'nguyenhaanhkiem@gmail.com',
    description: 'The email of the User',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'string',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  password: string;
}
