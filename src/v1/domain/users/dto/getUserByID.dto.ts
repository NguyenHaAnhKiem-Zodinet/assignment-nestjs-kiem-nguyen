import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getUserByIDDto {
  @ApiProperty({
    example: '48841276-024f-4e4d-8061-3319b0a0d52',
    description: 'The uuid of the User',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
