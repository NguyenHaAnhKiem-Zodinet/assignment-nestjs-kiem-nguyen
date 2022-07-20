import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserNotPassword } from '../../domain/users/user.entity';
import {
  RegisterDto,
  DeleteUserDto,
  LoginDto,
  UpdateDto,
  getUserByIDDto,
  ChangePasswordDto,
  GetAllUserDto,
} from '../../domain/users/dto';
import { UserService } from '../../domain/users/services/user.service';
import { JwtAuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/role.guard';
import { Roles } from './../../infrastructure/decorators/roles.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/api/v1/users')
  async getAllUsers(@Query() query?: GetAllUserDto): Promise<UserNotPassword[]> {
    try {
      if (query) {
        return await this.userService.findAll(query);
      }

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
  async register(@Body() conditionRegister: RegisterDto): Promise<UserNotPassword | boolean> {
    try {
      const registerUser: UserNotPassword | boolean = await this.userService.create(
        conditionRegister,
      );

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

  @UseGuards(JwtAuthGuard)
  @Put('/api/v1/users')
  async updateUser(@Body() conditionUpdate: UpdateDto): Promise<UserNotPassword | null> {
    try {
      const userChange = await this.userService.update(conditionUpdate);

      if (!userChange) {
        throw new HttpException('Account does not exist', HttpStatus.NO_CONTENT);
      }

      return userChange;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/api/v1/users/change-password')
  async changePassword(
    @Body() conditionChangePassword: ChangePasswordDto,
  ): Promise<UserNotPassword | null | boolean> {
    try {
      const isChangePassword: UserNotPassword | null | boolean =
        await this.userService.changePassword(conditionChangePassword);

      if (!isChangePassword) {
        throw new HttpException('Account does not exist', HttpStatus.NO_CONTENT);
      }

      return isChangePassword;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
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
