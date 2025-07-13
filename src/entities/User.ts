import { Entity, PrimaryKey, Property, Unique, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { Favorite } from './Favorite';

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

  @OneToMany(() => Favorite, favorite => favorite.user, { cascade: [Cascade.REMOVE] })
  favorites = new Collection<Favorite>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 