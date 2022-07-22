import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockUserDto {
  @ApiProperty({
    example: '426bb3e9-68fd-47c9-9df5-ec717f0f7bed',
    description: 'The uuid of the User',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    example: true,
    description: 'The block of the User',
    required: false,
  })
  @IsBoolean()
  isBlock: boolean;
}
