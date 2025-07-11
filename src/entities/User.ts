import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  email!: string;

  @Property({ length: 255 })
  passwordHash!: string;

  @Property({ length: 100 })
  name!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 