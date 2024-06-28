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

	@AfterUpdate()
	async afterUpdate() {
	  // Logic to refresh the corresponding Discord message
	  CategoryRepository.refreshCategoryMessage(this);
	}
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class CategoryRepository extends EntityRepository<Category> {
	static refreshCategoryMessage(category: Category) {
		throw new Error('Method not implemented.')
	}

	async findAllGamesInCategory(categoryId: number): Promise<Game[]> {
		const category = await this.findOneOrFail({id: categoryId}, { populate: ['children.games']});
		let games = [...category.games.getItems()];

		const processCategory = async (cat: Category) => {
			for (const child of cat.children) {
				games = [...games, ...child.games.getItems()];
				await processCategory(child); // Recursively process each child
			}
		};

		await processCategory(category);

		return games;
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

}