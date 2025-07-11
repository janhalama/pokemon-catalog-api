import { Migration } from '@mikro-orm/migrations';

export class Migration20250711154644 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "email" varchar(255) not null, "password_hash" varchar(255) not null, "name" varchar(100) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

}
