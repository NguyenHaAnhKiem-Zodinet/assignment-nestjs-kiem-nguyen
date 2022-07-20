import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserNotPassword } from '../../domain/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      if (!roles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user: UserNotPassword = request.user;

      return this.matchRoles(roles[0], user.role);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  private matchRoles(roles: string, rolesCheck: string): boolean {
    try {
      return roles === rolesCheck;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
