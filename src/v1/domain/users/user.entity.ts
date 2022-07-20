import {
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  BeforeInsert,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Authentication } from './services/authentication.service';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Unique('users', ['uuid', 'email'])
@Entity()
export class User {
  constructor(private readonly authentication: Authentication) {}

  @PrimaryColumn()
  @Generated('uuid')
  @AutoMap()
  uuid: string;

  @Column({
    length: 20,
    nullable: true,
  })
  @AutoMap()
  name: string;

  @Column({
    length: 8,
    nullable: true,
  })
  @AutoMap()
  username: string;

  @Column({
    unique: true,
    nullable: true,
  })
  @AutoMap()
  email: string;

  @Column({
    nullable: true,
  })
  @AutoMap()
  birthday: Date;

  @Column({
    nullable: true,
  })
  @AutoMap()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @AutoMap()
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  @AutoMap()
  isBlock: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await this.authentication.hashPassword(this.password);
  }
}

export class UserNotPassword {
  @AutoMap()
  uuid: string;

  @AutoMap()
  name: string;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  @AutoMap()
  birthday: Date;

  @AutoMap()
  role: string;

  @AutoMap()
  isBlock: boolean;
}
