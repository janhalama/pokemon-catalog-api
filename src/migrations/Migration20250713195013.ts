import { Migration } from '@mikro-orm/migrations';

export class Migration20250713195013 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "favorites" drop constraint "favorites_pokemon_id_foreign";`);
    this.addSql(`alter table "favorites" add constraint "favorites_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;`);
    
    this.addSql(`alter table "favorites" drop constraint "favorites_user_id_foreign";`);
    this.addSql(`alter table "favorites" add constraint "favorites_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "favorites" drop constraint "favorites_pokemon_id_foreign";`);
    this.addSql(`alter table "favorites" add constraint "favorites_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
    
    this.addSql(`alter table "favorites" drop constraint "favorites_user_id_foreign";`);
    this.addSql(`alter table "favorites" add constraint "favorites_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

}
