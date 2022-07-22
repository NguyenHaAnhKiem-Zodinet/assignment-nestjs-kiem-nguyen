import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserNotPassword } from '../user.entity';

@Injectable()
export class Authentication {
  constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const passwordHash: string = await bcrypt.hashSync(
        password,
        Number(this.config.get('ROUNDS')),
      );

      return passwordHash;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async comparePassword(password: string, passwordCheck: string): Promise<boolean> {
    try {
      const isCheckPassword = await bcrypt.compareSync(password, passwordCheck);

      return isCheckPassword;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  createJwtToken(user: UserNotPassword): string {
    try {
      return this.jwtService.sign({ ...user });
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
