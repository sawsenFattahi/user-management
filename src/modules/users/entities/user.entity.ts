import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import type { Role } from '@lesechos/common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  email?: string;

  @Column()
  name?: string;

  @Column()
  address?: Record<string, any>;

  @Column()
  comment?: string;
  constructor(
    id: string,
    username: string,
    password: string,
    role: Role,
    email?: string,
    name?: string,
    address?: Record<string, any>,
    comment?: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
    this.email = email;
    this.name = name;
    this.address = address;
    this.comment = comment;
  }
}
