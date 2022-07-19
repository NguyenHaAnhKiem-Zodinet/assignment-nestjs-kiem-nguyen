import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './services/user.service';
import { UserNotPassword } from './user.entity';
import { RegisterDto, DeleteUserDto, LoginDto, UpdateDto, getUserByIDDto } from './dto';
import { IUserSend } from './user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/api/v1/users')
  async getAllUsers(): Promise<UserNotPassword[]> {
    try {
      return await this.userService.findAll();
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/api/v1/users/:uuid')
  async getUser(@Param() params: getUserByIDDto): Promise<UserNotPassword | null> {
    try {
      const user: UserNotPassword | null = await this.userService.findOne(params.uuid);

      if (!user) {
        throw new HttpException('Account does not exist', HttpStatus.NO_CONTENT);
      }

      return user;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/v1/users/register')
  async register(@Body() conditionRegister: RegisterDto): Promise<IUserSend | boolean> {
    try {
      const registerUser: IUserSend | boolean = await this.userService.create(conditionRegister);

      if (!registerUser) {
        throw new HttpException('Account already exists', HttpStatus.NO_CONTENT);
      }

      return registerUser;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/v1/users/login')
  async login(@Body() conditionLogin: LoginDto): Promise<string | boolean> {
    try {
      const jwt: string | null | boolean = await this.userService.login(
        conditionLogin.email,
        conditionLogin.password,
      );

      if (!jwt) {
        throw new HttpException('Incorrect account or password', HttpStatus.NO_CONTENT);
      }

      return jwt;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/api/v1/users')
  async updateUser(@Body() conditionUpdate: UpdateDto): Promise<any> {
    try {
      return this.userService.update(conditionUpdate);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/api/v1/users/:uuid')
  async deleteUser(@Param() { uuid }: DeleteUserDto): Promise<string | boolean> {
    try {
      const isDelete = await this.userService.remove(uuid);

      if (!isDelete) {
        throw new HttpException('Account does not exist', HttpStatus.NO_CONTENT);
      }

      return isDelete;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
