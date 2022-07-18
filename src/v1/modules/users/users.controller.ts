import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { User } from './user.entity';
import { RegisterDto, DeleteUserDto, LoginDto } from './user.dto';
import { IUserSend } from './user.interface';

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

  @Post('/register')
  async register(
    @Body() user: RegisterDto,
    @Res() res: Response,
  ): Promise<IUserSend | boolean> {
    try {
      if (!user) {
        res.status(HttpStatus.BAD_REQUEST).send('');
      }

      const registerUser: IUserSend | boolean = await this.userService.create(
        user,
      );

      if (!registerUser) {
        res.status(HttpStatus.NO_CONTENT).send('Account already exists');
        return;
      }

      res.status(HttpStatus.OK).send(registerUser);
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      throw new Error(error as string);
    }
  }

  @Post('/login')
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

  @Delete('/:id')
  async deleteUser(@Param() { id }: DeleteUserDto): Promise<number> {
    return this.userService.remove(id);
  }
}
