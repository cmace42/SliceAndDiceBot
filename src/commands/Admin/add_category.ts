import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, ButtonBuilder,
	 TextChannel, ActionRowBuilder, TextInputBuilder, ModalBuilder,
	 ButtonStyle,
	 TextInputStyle} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guard, HasRole, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { CategoryEmbed, simpleSuccessEmbed, updateAllCategoryEmbeds, updateCategoryEmbed, updateMultipleCategoryEmbeds } from '@/utils/functions'
import { Game, Category as GameCategory } from '@/entities'
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
		HasRole("Orga")
	)
	async add(
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.ADD_CATEGORY.OPTIONS.NAME',
			required: true,
			type: ApplicationCommandOptionType.String,
		}) curname: string,
		@SlashOption({
			name: 'parent_category',
			localizationSource: 'COMMANDS.ADD_CATEGORY.OPTIONS.PARENT_CATEGORY',
			type: ApplicationCommandOptionType.String,
		}) p_category: string,
		@SlashOption({
			name: 'description',
			localizationSource: 'COMMANDS.ADD_CATEGORY.OPTIONS.DESCRIPTION',
			type: ApplicationCommandOptionType.String,
		}) description: string | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const categoryRepo = this.db.get(GameCategory)
		//categoryRepo.nativeDelete({})
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

			const button = new ButtonBuilder()
				.setCustomId(`openAddModal-${categoryData.name}`)
				.setLabel('Add Game')
				.setStyle(ButtonStyle.Primary);

			const delbutton = new ButtonBuilder()
				.setCustomId(`openRemoveModal-${categoryData.name}`)
				.setLabel('Remove Game')
				.setStyle(ButtonStyle.Danger);

			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents([button, delbutton]);
			

			let message = await channel.send({
				embeds: [embed],
				components: [row]
			});

			categoryData.messageID = message.id
			categoryRepo.persist(categoryData)
			updateMultipleCategoryEmbeds(categoryData.parent, client, localize, categoryRepo)
//			//await this.db.em.nativeDelete(GameCategory, {})
			categoryRepo.saveAllEntries()
			simpleSuccessEmbed(
				interaction, localize.COMMANDS.ADD_CATEGORY.EMBED.DESCRIPTION()
			)
		}
	}

}
