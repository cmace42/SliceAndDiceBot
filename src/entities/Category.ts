import { AfterUpdate, Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, TextType, Unique } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'

import { CustomBaseEntity } from './BaseEntity'
import { promises as fs } from 'fs'
import { Game } from './Game'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => CategoryRepository })
export class Category extends CustomBaseEntity {

	[EntityRepositoryType]?: CategoryRepository

	@PrimaryKey({ autoincrement: true })
	id!: number

	@Property()
	@Unique()
	name: string

	@Property({ default: null, nullable: true, type: TextType })
	description: string

	@Property({ default: null, nullable: true })
	@Unique()
	messageID: string

	@ManyToOne('Category', { default: null, nullable: true })
	parent: Category

	@OneToMany(() => Category, (category: Category) => category.parent)
	children: Collection<Category> = new Collection<Category>(this);

	@ManyToMany(() => Game)
	games: Collection<Game> = new Collection<Game>(this);

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class CategoryRepository extends EntityRepository<Category> {

	async findAllGamesInCategory(categoryId: number): Promise<Game[]> {
		const category = await this.findOneOrFail({id: categoryId});
		const uniqueGames = new Map<string, Game>(); // Use a Map to ensure uniqueness

		const processCategory = async (cat: Category) => {
			await this.populate(cat, ['games', 'children']);
			for (const game of cat.games.getItems()) {
				if (!uniqueGames.has(game.id)) { // Check if the game is already added
					uniqueGames.set(game.id, game); // Use game ID as the key
				}
			}

			for (const child of cat.children) {
				await processCategory(child); // Recursively process each child
			}
		};

		await processCategory(category);

		// Convert the Map's values to an array
		return Array.from(uniqueGames.values());
	}

	async saveAllEntries(filename: string = 'assets/files/category_save.json'): Promise<void> {
		// Assuming 'games' and 'children' are the relation fields in your Category entity
		const categories = await this.find({}, {
		populate: ['games', 'children'],
		fields: ['name', 'description', 'parent.name', 'games.name', 'children.name'] // Specify only the names to be fetched
		});

		if (categories.length > 0) {
			const data = JSON.stringify(categories, null, 2);
			await fs.writeFile(filename, data);
		}
	}

	async delGameFromCategory(categoryName: string, gameName: string): Promise<void> {
		const category = await this.findOneOrFail({ name: categoryName }, { populate: ['games', 'children'] });
		const game = category.games.getItems().find(g => g.name === gameName);
		if (game) {
			category.games.remove(game);
			await this.persist(category);
		} else {
			// If the game is not found in the current category, search in children
			for (const child of category.children.getItems()) {
				// Recursively call this method for each child
				await this.delGameFromCategory(child.name, gameName);
			}
		}
	}

}