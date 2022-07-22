import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OtpGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const otp: string = request.body.otp;
      const isValid = authenticator.check(otp, this.config.get('OTP_SECRET_KEY'));

      return isValid;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
