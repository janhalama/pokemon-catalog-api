import { Entity, PrimaryKey, Property, ManyToOne, Unique, Index, Cascade } from '@mikro-orm/core';
import { User } from './User';
import { Pokemon } from './Pokemon';

@Entity({ tableName: 'favorites' })
@Unique({ properties: ['user', 'pokemon'] })
@Index({ properties: ['user'] })
@Index({ properties: ['pokemon'] })
export class Favorite {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  user!: User;

  @ManyToOne(() => Pokemon, { cascade: [Cascade.REMOVE] })
  pokemon!: Pokemon;

  @Property()
  createdAt: Date = new Date();
} 