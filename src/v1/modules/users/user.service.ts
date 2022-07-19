import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { User, UserNotPassword } from './user.entity';
import { hashPassword, comparePassword, createJwtToken } from '../../helpers';
import { IUserSend } from './user.interface';
import { RegisterDto, UpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectMapper() private mapper: Mapper,
  ) {}

  mappingFromUserRepository(user: User): IUserSend {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async findOne(uuid: string): Promise<UserNotPassword | null> {
    try {
      const user = await this.usersRepository.findOneBy({ uuid });

      return this.mapper.map(user, User, UserNotPassword) ?? null;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
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
      const userEntity = this.usersRepository.create({ ...userHash });
      const userCreate: User = await this.usersRepository.save(userEntity);

      if (userCreate) {
        return this.mappingFromUserRepository(userCreate);
      }

      return false;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async login(email: string, password: string): Promise<string | null | boolean> {
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

  async update(id: number, user: UpdateDto): Promise<IUserSend> {
    try {
      const userChange: User = await this.usersRepository.save({
        id,
        ...user,
      });

      return this.mappingFromUserRepository(userChange);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async remove(id: number): Promise<number> {
    await this.usersRepository.delete(id);
    return id;
  }
}
