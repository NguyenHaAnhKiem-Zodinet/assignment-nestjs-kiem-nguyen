import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { User, UserNotPassword } from '../user.entity';
import { comparePassword, createJwtToken } from '../../../helpers';
import { ChangePasswordDto, RegisterDto, UpdateDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async findAll(): Promise<UserNotPassword[]> {
    try {
      const listUsers: User[] = await this.usersRepository.find();

      return this.mapper.mapArray(listUsers, User, UserNotPassword);
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

  async create(user: RegisterDto): Promise<UserNotPassword | boolean> {
    try {
      const account: User = await this.usersRepository.findOneBy({
        email: user.email,
      });

      if (account) {
        return false;
      }

      const userEntity = this.usersRepository.create(user);
      const userCreate: User = await this.usersRepository.save(userEntity);

      if (userCreate) {
        return this.mapper.map(userCreate, User, UserNotPassword);
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

      const userMap = this.mapper.map(user, User, UserNotPassword);
      return createJwtToken(userMap);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async update(user: UpdateDto): Promise<UserNotPassword | null> {
    try {
      const userNow: User = await this.usersRepository.findOneBy({ uuid: user.uuid });

      if (!userNow) {
        return null;
      }

      const userChange = await this.usersRepository.save({
        ...user,
      });

      return this.mapper.map(userChange, User, UserNotPassword);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async remove(uuid: string): Promise<string | boolean> {
    try {
      const isDelete: DeleteResult = await this.usersRepository.delete(uuid);

      if (isDelete.affected > 0) {
        return uuid;
      }

      return false;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async changePassword(user: ChangePasswordDto): Promise<UserNotPassword | null | boolean> {
    try {
      const userNow: User = await this.usersRepository.findOneBy({ uuid: user.uuid });

      if (!userNow) {
        return null;
      }

      const isCheckPassword = await comparePassword(user.passwordOld, userNow.password);

      if (!isCheckPassword) {
        return false;
      }

      const userChange: User = await this.usersRepository.save({
        ...user,
      });

      return this.mapper.map(userChange, User, UserNotPassword);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
