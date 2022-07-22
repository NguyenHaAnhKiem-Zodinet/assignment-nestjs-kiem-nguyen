import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    example: 123456,
    description: 'The otp check user',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
