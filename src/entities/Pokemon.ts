import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'pokemon' })
@Index({ properties: ['name'] })
@Index({ properties: ['types'] })
export class Pokemon {
  @PrimaryKey()
  id!: string;

  @Property({ length: 100 })
  name!: string;

  @Property({ length: 100 })
  classification!: string;

  @Property({ type: 'json' })
  types!: string[];

  @Property({ type: 'json' })
  resistant!: string[];

  @Property({ type: 'json' })
  weaknesses!: string[];

  @Property({ type: 'json' })
  weight!: {
    minimum: string;
    maximum: string;
  };

  @Property({ type: 'json' })
  height!: {
    minimum: string;
    maximum: string;
  };

  @Property({ type: 'float' })
  fleeRate!: number;

  @Property({ type: 'json' })
  evolutionRequirements!: {
    amount: number;
    name: string;
  };

  @Property({ type: 'json' })
  evolutions!: Array<{
    id: number;
    name: string;
  }>;

  @Property({ type: 'int' })
  maxCP!: number;

  @Property({ type: 'int' })
  maxHP!: number;

  @Property({ type: 'json' })
  attacks!: {
    fast: Array<{
      name: string;
      type: string;
      damage: number;
    }>;
    special: Array<{
      name: string;
      type: string;
      damage: number;
    }>;
  };

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
} 