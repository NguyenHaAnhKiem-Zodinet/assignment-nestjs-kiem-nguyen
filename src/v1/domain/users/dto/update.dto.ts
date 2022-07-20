import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsBoolean()
  isBlock: boolean;
}
