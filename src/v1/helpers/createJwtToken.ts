import * as jwt from 'jsonwebtoken';
import { IUserSend } from '../modules/users/user.interface';

export const createJwtToken = (user: IUserSend): string => {
  try {
    const accessToken = jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: process.env.TIMERESET,
    });

    return accessToken;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
