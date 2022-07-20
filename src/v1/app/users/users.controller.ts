import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  UpdateDto,
  getUserByIDDto,
  ChangePasswordDto,
  GetAllUserDto,
} from '../../domain/users/dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotPassword } from '../../domain/users/user.entity';
import { UserService } from '../../domain/users/services/user.service';
import { JwtAuthGuard } from '../../infrastructure/guards/auth.guard';

@ApiTags('users')
@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, description: 'All users' })
  @ApiResponse({ status: 204, description: 'No accounts exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('/')
  async getAllUsers(@Query() query?: GetAllUserDto): Promise<UserNotPassword[]> {
    try {
      const listUsers: UserNotPassword[] = await this.userService.findAll(query);

      if (listUsers.length === 0) {
        throw new HttpException('No accounts exist', HttpStatus.NO_CONTENT);
      }

      return listUsers;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get User By UUID' })
  @ApiResponse({ status: 200, description: 'Users By UUID' })
  @ApiResponse({ status: 204, description: 'Account does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('/:uuid')
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

  @ApiOperation({ summary: 'User Register' })
  @ApiResponse({ status: 200, description: 'Sign Up Success' })
  @ApiResponse({ status: 204, description: 'Account already exists' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Post('/register')
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

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 204, description: 'Incorrect account or password' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Post('/login')
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

  @ApiOperation({ summary: 'User Update' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Update successful' })
  @ApiResponse({ status: 204, description: 'Account does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseGuards(JwtAuthGuard)
  @Put('/')
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

  @ApiOperation({ summary: 'User Change Password' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Change password successful' })
  @ApiResponse({ status: 204, description: 'Incorrect password' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @Body() conditionChangePassword: ChangePasswordDto,
    @Req() req,
  ): Promise<UserNotPassword | null | boolean> {
    try {
      if (req.user.uuid !== conditionChangePassword.uuid) {
        throw new HttpException('UUID does not match', HttpStatus.BAD_REQUEST);
      }

      const isChangePassword: UserNotPassword | null | boolean =
        await this.userService.changePassword(conditionChangePassword);

      if (!isChangePassword) {
        throw new HttpException('Incorrect password', HttpStatus.NO_CONTENT);
      }

      return isChangePassword;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
