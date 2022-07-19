import { hashPassword } from './../../helpers/hashPassword';
import { Entity, Column, PrimaryColumn, Unique, BeforeInsert, Generated } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Unique('users', ['uuid', 'email'])
@Entity()
export class User {
  @PrimaryColumn()
  @Generated('uuid')
  @AutoMap()
  uuid: string;

  @Column({
    length: 20,
    default: true,
    nullable: true,
  })
  @AutoMap()
  name: string;

  @Column({
    length: 8,
    default: true,
    nullable: true,
  })
  @AutoMap()
  username: string;

  @Column({
    unique: true,
    default: true,
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
    default: true,
    nullable: true,
  })
  @AutoMap()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
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
}
