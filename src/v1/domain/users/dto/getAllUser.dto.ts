import { Type } from 'class-transformer';

export class GetAllUserDto {
  limit?: number;
  page?: number;
  email?: string;
  name?: string;
  username?: string;
}
