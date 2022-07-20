import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetAllUserDto {
  @ApiProperty({
    example: '10',
    description: 'The limit of the User',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: '0',
    description: 'The page of the User',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    example: 'nguyenhaanhkiem@gmail.com',
    description: 'The email of the User',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'Kiem12345',
    description: 'The name of the User',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Anhm0@',
    description: 'The username of the User',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;
}
