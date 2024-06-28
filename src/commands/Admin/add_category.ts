import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, TextChannel} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guard, HasRole, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { CategoryEmbed, simpleSuccessEmbed } from '@/utils/functions'
import { Category as GameCategory } from '@/entities'
import { AlreadyExistError, UnknownReplyError } from '@/errors'

@Discord()
@Injectable()
@Category('Admin')
export default class AddCategoryCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'add_category' })
	@Guard(
		//HasRole("Orga")
	)
	async add(
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NAME',
			required: true,
			type: ApplicationCommandOptionType.String,
		}) curname: string,
		@SlashOption({
			name: 'parent_category',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NEWNAME',
			type: ApplicationCommandOptionType.String,
		}) p_category: string,
		@SlashOption({
			name: 'description',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.DESCRIPTION',
			type: ApplicationCommandOptionType.String,
		}) description: string | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const categoryRepo = this.db.get(GameCategory)
		let categoryData = await categoryRepo.findOne({ name: curname})
		if (categoryData && categoryData.messageID) {
			throw new AlreadyExistError(interaction, curname)
		} else {
			categoryData = new GameCategory()
			categoryData.name = curname
			if (p_category) {
				const parentData = await categoryRepo.findOne({ name: p_category})
				if (!parentData) {
					throw new UnknownReplyError(interaction, p_category)
				}
				categoryData.parent = parentData
			}
			if (description)
				categoryData.description = description

			const embed = await CategoryEmbed({category:categoryData, locale:localize, categoryRepo, isNew:true})
			const channel = await client.channels.fetch("1256159215332888617");
			if (!channel || !(channel instanceof TextChannel)) {
				interaction.followUp({
					content: 'Channel is badly setup.'
				})
				return ;
			}
			let message = await channel.send({embeds:[embed]})
			categoryData.messageID = message.id
			categoryRepo.persist(categoryData)
//			//await this.db.em.nativeDelete(GameCategory, {})
			categoryRepo.saveAllEntries()
			simpleSuccessEmbed(
				interaction, "Category successfully added."
			)
		}
	}

}
