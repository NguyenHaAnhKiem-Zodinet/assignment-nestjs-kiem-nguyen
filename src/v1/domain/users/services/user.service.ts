import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { Authentication } from './authentication.service';
import { User, UserNotPassword } from '../user.entity';
import { BlockUserDto, ChangePasswordDto, GetAllUserDto, RegisterDto, UpdateDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectMapper() private mapper: Mapper,
    private readonly authentication: Authentication,
  ) {}

  async findAll(query?: GetAllUserDto): Promise<UserNotPassword[]> {
    try {
      const limit = query?.limit || 0;
      const page = query?.page || 0;
      const email = query?.email || '';
      const username = query?.username || '';
      const name = query?.name || '';

      const [listUsers, count]: [User[], number] = await this.usersRepository.findAndCount({
        where: {
          email: Like(`%${email}%`),
          username: Like(`%${username}%`),
          name: Like(`%${name}%`),
        },
        order: { email: 'DESC' },
        take: limit,
        skip: page,
      });

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

      const hashPassword = await this.authentication.hashPassword(user.password);
      const userCreate: User = await this.usersRepository.save({ ...user, password: hashPassword });

      if (userCreate) {
        return this.mapper.map(userCreate, User, UserNotPassword);
      }

      return false;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async login(email: string, password: string, captcha: string): Promise<string | null | boolean> {
    try {
      const user: User = await this.usersRepository.findOneBy({
        email,
      });

      if (!user) {
        return null;
      }

      const isCheckPassword = await this.authentication.comparePassword(password, user.password);

      if (!isCheckPassword) {
        return false;
      }

      const userMap = this.mapper.map(user, User, UserNotPassword);
      return this.authentication.createJwtToken(userMap);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async update(user: UpdateDto | BlockUserDto): Promise<UserNotPassword | null> {
    try {
      const userNow: User = await this.usersRepository.findOneBy({ uuid: user.uuid });

      if (!userNow) {
        return null;
      }

      const userEntity = { ...userNow, ...user };
      const userChange = await this.usersRepository.save(userEntity);

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

      const isCheckPassword = await this.authentication.comparePassword(
        user.passwordOld,
        userNow.password,
      );

      if (!isCheckPassword) {
        return false;
      }

      const hashPassword = await this.authentication.hashPassword(user.passwordNew);
      const userChange: User = await this.usersRepository.save({
        ...userNow,
        password: hashPassword,
      });

      return this.mapper.map(userChange, User, UserNotPassword);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
