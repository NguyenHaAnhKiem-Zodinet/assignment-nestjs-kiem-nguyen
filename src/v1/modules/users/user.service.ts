import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { User } from './user.entity';
import { hashPassword, comparePassword, createJwtToken } from '../../helpers';
import { IUserSend } from './user.interface';
import { RegisterDto, UpdateDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  mappingFromUserRepository(user: User): IUserSend {
    const { password, ...rest } = user;
    return rest;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(user: RegisterDto): Promise<IUserSend | boolean> {
    try {
      const account: User = await this.usersRepository.findOneBy({
        email: user.email,
      });

      if (account) {
        return false;
      }

      const passwordHash: string = await hashPassword(user.password);
      const userHash: RegisterDto = {
        ...user,
        password: passwordHash,
      };

      const userCreate: User = await this.usersRepository.save(userHash);

      if (userCreate) {
        return this.mappingFromUserRepository(userCreate);
      }

      return false;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<string | null | boolean> {
    try {
      const user: User = await this.usersRepository.findOneBy({
        email,
      });

      if (!user) {
        return null;
      }

      const isCheckPassword = await comparePassword(password, user.password);

      if (!isCheckPassword) {
        return false;
      }

      const userMap = this.mappingFromUserRepository(user);
      return createJwtToken(userMap);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  update(id: number, user: UpdateDto): Promise<UpdateResult> {
    try {
      return this.usersRepository.update(id, user);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async remove(id: number): Promise<number> {
    await this.usersRepository.delete(id);
    return id;
  }
}
