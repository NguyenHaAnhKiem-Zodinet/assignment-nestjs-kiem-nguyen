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

import { UserService } from './user.service';
import { User, UserNotPassword } from './user.entity';
import { RegisterDto, DeleteUserDto, LoginDto, UpdateDto, getUserByIDDto } from './dto';
import { IUserSend } from './user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/api/v1/users')
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/api/v1/users/:uuid')
  async getUser(@Param() params: getUserByIDDto): Promise<UserNotPassword> {
    try {
      return await this.userService.findOne(params.uuid);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/v1/users/register')
  async register(@Body() user: RegisterDto): Promise<IUserSend | boolean> {
    try {
      const registerUser: IUserSend | boolean = await this.userService.create(user);

      if (!registerUser) {
        throw new HttpException('Account already exists', HttpStatus.NO_CONTENT);
      }

      return registerUser;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/v1/users/login')
  async login(
    @Body() conditionLogin: LoginDto,
    @Res() res: Response,
  ): Promise<IUserSend | boolean> {
    try {
      if (!conditionLogin.email || !conditionLogin.password) {
        res.status(HttpStatus.BAD_REQUEST).send('Bad Request');
        return;
      }

      const jwt: string | null | boolean = await this.userService.login(
        conditionLogin.email,
        conditionLogin.password,
      );

      if (!jwt) {
        res.status(HttpStatus.NO_CONTENT).send('Incorrect account or password');
        return;
      }

      res.status(HttpStatus.OK).send(jwt);
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      throw new Error(error as string);
    }
  }

  @Put('/api/v1/users/:id')
  async updateUser(
    @Body() conditionUpdate: UpdateDto,
    @Res() res: Response,
    @Param() id: string,
  ): Promise<any> {
    try {
      if (!id || !conditionUpdate) {
        res.status(HttpStatus.BAD_REQUEST).send('');
      }

      return this.userService.update(Number(id), conditionUpdate);
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      throw new Error(error as string);
    }
  }

  @Delete('/api/v1/users/:id')
  async deleteUser(@Param() { uuid }: DeleteUserDto): Promise<number> {
    return this.userService.remove(uuid);
  }
}
