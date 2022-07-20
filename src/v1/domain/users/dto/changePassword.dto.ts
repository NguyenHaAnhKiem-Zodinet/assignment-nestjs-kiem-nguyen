import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '9e764b31-8110-47a5-a03d-b876daefbb79',
    description: 'The uuid of the User',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    example: 'string',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  @IsString()
  passwordOld: string;

  @ApiProperty({
    example: 'Anhkiem0701@.',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  @IsString()
  passwordNew: string;
}
