'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240628142440 extends Migration {

  async up() {
    this.addSql('create table `category` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `description` text null default null, `message_id` text null default null, `parent_id` integer null default null, constraint `category_parent_id_foreign` foreign key(`parent_id`) references `category`(`id`) on delete set null on update cascade);');
    this.addSql('create unique index `category_name_unique` on `category` (`name`);');
    this.addSql('create unique index `category_message_id_unique` on `category` (`message_id`);');
    this.addSql('create index `category_parent_id_index` on `category` (`parent_id`);');

    this.addSql('create table `category_games` (`category_id` integer not null, `game_id` text not null, constraint `category_games_category_id_foreign` foreign key(`category_id`) references `category`(`id`) on delete cascade on update cascade, constraint `category_games_game_id_foreign` foreign key(`game_id`) references `game`(`id`) on delete cascade on update cascade, primary key (`category_id`, `game_id`));');
    this.addSql('create index `category_games_category_id_index` on `category_games` (`category_id`);');
    this.addSql('create index `category_games_game_id_index` on `category_games` (`game_id`);');
  }

}
exports.Migration20240628142440 = Migration20240628142440;
