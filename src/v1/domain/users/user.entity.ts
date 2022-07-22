import {
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { UserRole } from '../../infrastructure/types/userRole.enum';

@Unique('users', ['uuid', 'email'])
@Entity()
export class User {
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
