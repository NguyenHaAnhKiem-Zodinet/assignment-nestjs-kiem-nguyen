import { IsNotEmpty, IsString, MinLength, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
