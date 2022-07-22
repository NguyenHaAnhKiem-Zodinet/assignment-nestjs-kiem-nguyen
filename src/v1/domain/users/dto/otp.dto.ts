import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    example: 123456,
    description: 'The otp check user',
  })
  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
