'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240502092433 extends Migration {

  async up() {
    this.addSql('create table `data` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `value` text not null default \'\', primary key (`key`));');

    this.addSql('create table `game` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `proprio` text null default null, `description` text null default \'Missing description.\', `timemin` integer null default null, `timemax` integer null default null, `nbrmin` integer null default null, `nbrmax` integer null default null, `available` integer not null default true, `jdr` integer not null default true, `message_id` text null default null, unique (`id`));');
    this.addSql('create unique index `game_name_unique` on `game` (`name`);');
    this.addSql('create unique index `game_message_id_unique` on `game` (`message_id`);');

    this.addSql('create table `guild` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `prefix` text null, `deleted` integer not null default false, `last_interact` datetime not null, primary key (`id`));');

    this.addSql('create table `image` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `file_name` text not null, `base_path` text not null default \'\', `url` text not null, `size` integer not null, `tags` text not null, `hash` text not null, `delete_hash` text not null);');

    this.addSql('create table `pastebin` (`id` text not null, `edit_code` text not null, `lifetime` integer not null default -1, `created_at` datetime not null, primary key (`id`));');

    this.addSql('create table `stat` (`id` integer not null primary key autoincrement, `type` text not null, `value` text not null default \'\', `additional_data` json null, `created_at` datetime not null);');

    this.addSql('create table `user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, primary key (`id`));');
  }

}
exports.Migration20240502092433 = Migration20240502092433;
