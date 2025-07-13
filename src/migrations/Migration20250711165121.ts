import { Migration } from '@mikro-orm/migrations';

export class Migration20250711165121 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon" ("id" serial primary key, "external_id" varchar(50) not null, "name" varchar(100) not null, "classification" varchar(100) not null, "types" jsonb not null, "resistant" jsonb not null, "weaknesses" jsonb not null, "weight" jsonb not null, "height" jsonb not null, "flee_rate" real not null, "evolution_requirements" jsonb not null, "evolutions" jsonb not null, "max_cp" int not null, "max_hp" int not null, "attacks" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`create index "pokemon_types_index" on "pokemon" ("types");`);
    this.addSql(`create index "pokemon_name_index" on "pokemon" ("name");`);
    this.addSql(`create index "pokemon_external_id_index" on "pokemon" ("external_id");`);
    this.addSql(`alter table "pokemon" add constraint "pokemon_external_id_unique" unique ("external_id");`);

    this.addSql(`create table "favorites" ("id" serial primary key, "user_id" int not null, "pokemon_id" int not null, "created_at" timestamptz not null);`);
    this.addSql(`create index "favorites_pokemon_id_index" on "favorites" ("pokemon_id");`);
    this.addSql(`create index "favorites_user_id_index" on "favorites" ("user_id");`);
    this.addSql(`alter table "favorites" add constraint "favorites_user_id_pokemon_id_unique" unique ("user_id", "pokemon_id");`);

    this.addSql(`alter table "favorites" add constraint "favorites_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "favorites" add constraint "favorites_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "favorites" drop constraint "favorites_pokemon_id_foreign";`);
    this.addSql(`alter table "favorites" drop constraint "favorites_user_id_foreign";`);
    this.addSql(`drop table if exists "favorites" cascade;`);
    this.addSql(`drop table if exists "pokemon" cascade;`);
  }

}
