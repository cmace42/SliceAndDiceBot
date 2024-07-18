import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, ButtonBuilder,
	 TextChannel, ActionRowBuilder, ButtonStyle} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guard, HasRole, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { CategoryEmbed, simpleErrorEmbed, simpleSuccessEmbed, updateAllCategoryEmbeds } from '@/utils/functions'
import { Category as GameCategory } from '@/entities'

@Discord()
@Injectable()
@Category('Admin')
export default class EditCategoryCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'edit_category' })
	@Guard(
		HasRole("Orga")
	)
	async edit_cat(
		@SlashOption({
			name: 'activate',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.AVAILABLE',
			type: ApplicationCommandOptionType.Boolean,
		}) activate: boolean,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const categoryRepo = this.db.get(GameCategory)
		let categoriesData = await categoryRepo.find({});
		const channel = await client.channels.fetch("1258379271156535406");
		if (!channel || !(channel instanceof TextChannel)) {
			simpleErrorEmbed(
				interaction, 'Channel is badly setup.'
			)
			return ;
		}

		const totalCategories = categoriesData.length;
		let processedCategories = 0;
		// Use Promise.all to wait for all refreshGame promises to resolve
		await Promise.all(categoriesData.map(async (categoryData) => {
			if (categoryData.messageID) {
				const embed = await CategoryEmbed({category: categoryData, locale: localize, categoryRepo, isNew: false});

				let rowarray = []
				if (activate) {
					const button = new ButtonBuilder()
						.setCustomId(`openAddModal-${categoryData.name}`)
						.setLabel('Add Game')
						.setStyle(ButtonStyle.Primary);

					const editbutton = new ButtonBuilder()
						.setCustomId(`openEditModal-${categoryData.name}`)
						.setLabel('Edit Description')
						.setStyle(ButtonStyle.Secondary);

					const delbutton = new ButtonBuilder()
						.setCustomId(`openRemoveModal-${categoryData.name}`)
						.setLabel('Remove Game')
						.setStyle(ButtonStyle.Danger);

					const row = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(button, editbutton, delbutton);
					rowarray.push(row)
				}
				await channel.messages.edit(categoryData.messageID, {
					embeds: [embed],
					components: rowarray
				});
			}
			processedCategories++
			await interaction.editReply({
				content: `Categories refreshed: ${processedCategories}/${totalCategories}`
			})
		}));
		updateAllCategoryEmbeds(categoryRepo, client, localize)
		simpleSuccessEmbed(
			interaction, localize.COMMANDS.ADD_CATEGORY.EMBED.DESCRIPTION()
		)
	}

}
