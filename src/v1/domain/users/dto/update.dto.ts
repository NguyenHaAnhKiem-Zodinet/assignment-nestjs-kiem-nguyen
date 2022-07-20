import { IsNotEmpty, IsString, MinLength, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({
    example: '9e764b31-8110-47a5-a03d-b876daefbb79',
    description: 'The uuid of the User',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    example: 'Nguyen Ha Anh Kiem',
    description: 'The name of the User',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    example: '2022-07-18T07:21:30.000Z',
    description: 'The birthday of the User',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
