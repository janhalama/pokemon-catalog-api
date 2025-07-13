import { Migration } from '@mikro-orm/migrations';

export class Migration20250713215421_AddGinIndexForPokemonType extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create index "pokemon_types_gin_idx" on "pokemon" using gin ("types");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "pokemon_types_gin_idx";`);
  }

}
