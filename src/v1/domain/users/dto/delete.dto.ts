import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: '9e764b31-8110-47a5-a03d-b876daefbb79',
    description: 'The uuid of the User',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
