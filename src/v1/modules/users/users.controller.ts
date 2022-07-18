import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { DtoDeleteUser } from './dto/deleteUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async getUser(@Param() params): Promise<User> {
    return await this.userService.findOne(params.id);
  }

  @Post()
  async createUser(@Body() userDto: User): Promise<User> {
    return this.userService.create(userDto);
  }

  @Delete('/:id')
  async deleteUser(@Param() { id }: DtoDeleteUser): Promise<number> {
    return this.userService.remove(id);
  }
}
