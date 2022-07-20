import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserNotPassword } from '../../domain/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'anhkiem',
    });
  }

  validate(payload: UserNotPassword) {
    try {
      return payload;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
