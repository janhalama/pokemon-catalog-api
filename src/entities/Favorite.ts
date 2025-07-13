import { Entity, PrimaryKey, Property, ManyToOne, Unique, Index } from '@mikro-orm/core';
import { User } from './User';
import { Pokemon } from './Pokemon';

@Entity({ tableName: 'favorites' })
@Unique({ properties: ['user', 'pokemon'] })
@Index({ properties: ['user'] })
@Index({ properties: ['pokemon'] })
export class Favorite {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;

  @Property()
  createdAt: Date = new Date();
} 