import { Entity, EntityRepositoryType, PrimaryKey, Property, TextType, Unique } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'

import { CustomBaseEntity } from './BaseEntity'
import { promises as fs } from 'fs'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => GameRepository })
export class Game extends CustomBaseEntity {

	[EntityRepositoryType]?: GameRepository

	@PrimaryKey({ autoincrement: true })
	id!: string

	@Property()
	@Unique()
	name: string

	@Property({ default: null, nullable: true })
	proprio: string

	@Property({ default: null, nullable: true, type: TextType })
	description = "Missing description."

	@Property({ default: null, nullable: true })
	timemin: number

	@Property({ default: null, nullable: true })
	timemax: number

	@Property({ default: null, nullable: true })
	nbrmin: number

	@Property({ default: null, nullable: true })
	nbrmax: number

	@Property({ default: true })
	available: boolean

	@Property({ default: true })
	jdr: boolean

	@Property({ default: null, nullable: true })
	@Unique()
	messageID: string

	@Property()
	lastInteract: Date = new Date()

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class GameRepository extends EntityRepository<Game> {

	async updateLastInteract(userId?: string): Promise<void> {
		const user = await this.findOne({ id: userId })

		if (user) {
			user.lastInteract = new Date()
			await this.flush()
		}
	}

	async saveAllEntries(filename: string = 'assets/files/save.json'): Promise<void> {
		const games = await this.findAll({})

		if (games) {
			const data = JSON.stringify(games, null, 2);
			await fs.writeFile(filename, data);
		}
	}
}