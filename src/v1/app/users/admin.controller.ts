import {
  Controller,
  Body,
  Put,
  HttpStatus,
  HttpException,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserNotPassword } from '../../domain/users/user.entity';
import { ChangePasswordDto, DeleteUserDto, BlockUserDto } from '../../domain/users/dto';
import { UserService } from '../../domain/users/services/user.service';
import { JwtAuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/role.guard';
import { Roles } from './../../infrastructure/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('/api/v1/admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Block User By UUID' })
  @ApiResponse({ status: 200, description: 'Block successful' })
  @ApiResponse({ status: 204, description: 'Account does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/block')
  async updateUser(@Body() conditionBlock: BlockUserDto): Promise<UserNotPassword | null> {
    try {
      const userChange = await this.userService.update(conditionBlock);

      if (!userChange) {
        throw new HttpException('Account does not exist', HttpStatus.NO_CONTENT);
      }

      return userChange;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Change Password User By UUID' })
  @ApiResponse({ status: 200, description: 'Change password successful' })
  @ApiResponse({ status: 204, description: 'Account does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/change-password')
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

  @ApiOperation({ summary: 'Delete User By UUID' })
  @ApiResponse({ status: 200, description: 'Delete successful' })
  @ApiResponse({ status: 204, description: 'Account does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:uuid')
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
