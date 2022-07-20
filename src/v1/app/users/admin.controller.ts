import { Controller, Body, Put, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { UserNotPassword } from '../../domain/users/user.entity';
import { UpdateDto, ChangePasswordDto } from '../../domain/users/dto';
import { UserService } from '../../domain/users/services/user.service';
import { JwtAuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/role.guard';
import { Roles } from './../../infrastructure/decorators/roles.decorator';

@Controller()
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/api/v1/admin/block')
  async updateUser(@Body() conditionBlock: UpdateDto): Promise<UserNotPassword | null> {
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

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/api/v1/admin/change-password')
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
}
