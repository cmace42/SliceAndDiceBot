import { ButtonInteraction, CacheType, CommandInteraction, GuildMember, ModalSubmitInteraction } from 'discord.js'
import { ArgsOf, Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Guard, Injectable, On } from '@/decorators'
import { Guild, User, Game, Category as GameCategory } from '@/entities'
import { Maintenance } from '@/guards'
import { Database, Logger, Stats } from '@/services'
import { syncUser, updateAllCategoryEmbeds, updateCategoryEmbed, updateMultipleCategoryEmbeds } from '@/utils/functions'
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Category } from '@discordx/utilities'
import { mem } from 'node-os-utils'
import { L, getLocaleFromInteraction } from '@/i18n'

@Discord()
@Injectable()
export default class InteractionCreateEvent {

	constructor(
		private stats: Stats,
		private logger: Logger,
		private db: Database
	) {}

	@On('interactionCreate')
	@Guard(
		Maintenance
	)
	async interactionCreateHandler(
		[interaction]: ArgsOf<'interactionCreate'>,
		client: Client,
	) {
		// defer the reply
		if (
			generalConfig.automaticDeferring
			&& interaction instanceof CommandInteraction
		) await interaction.deferReply()

		// insert user in db if not exists
		await syncUser(interaction.user)

		// update last interaction time of both user and guild
		await this.db.get(User).updateLastInteract(interaction.user.id)
		await this.db.get(Guild).updateLastInteract(interaction.guild?.id)

		// register logs and stats
		await this.stats.registerInteraction(interaction as AllInteractions)
		this.logger.logInteraction(interaction as AllInteractions)

		// Custom events handle
		if (interaction.isButton()) {
			const localize = L[getLocaleFromInteraction(interaction)]
			let member: GuildMember | null = interaction.member as GuildMember;
			if (!member || !member.roles.cache.some(role => role.name === "Orga")) {
				await interaction.reply({ content: localize.GUARDS.ROLE(), ephemeral: true });
			} else {
				if (interaction.customId.startsWith('openAddModal'))
					this.openAddModal(interaction)
				else if (interaction.customId.startsWith('openRemoveModal'))
					this.openRemoveModal(interaction)
			}
		} else if (interaction.isModalSubmit()) {
			const localize = L[getLocaleFromInteraction(interaction)]
			if (interaction.customId.startsWith('gameModal')) {
				this.addGameToCategory(interaction, client, localize)
			} else if (interaction.customId.startsWith('delgameModal')) {
				this.delGameFromCategory(interaction, client, localize)
			}
		}

		client.executeInteraction(interaction)
	}

	async openAddModal(interaction: ButtonInteraction<CacheType>) {
		const textInput = new TextInputBuilder()
			.setCustomId('add_game_category')
			.setLabel('Game to add')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Add a game to the category');

		const modal = new ModalBuilder()
			.setTitle('Add a Game')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
			);

		// Show the modal when the button is clicked
		const categoryName = interaction.customId.split('-')[1]; // Extract the categoryId
		// Adjust the modal's customId to include the categoryId
		modal.setCustomId(`gameModal-${categoryName}`);
		//console.log(interaction)
		await interaction.showModal(modal);
	}

	async openRemoveModal(interaction: ButtonInteraction<CacheType>) {
		const textInput = new TextInputBuilder()
			.setCustomId('del_game_category')
			.setLabel('Game to remove')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Remove a game from the category');

		const modal = new ModalBuilder()
			.setTitle('Remove a Game')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
			);

		// Show the modal when the button is clicked
		const categoryName = interaction.customId.split('-')[1]; // Extract the categoryId
		// Adjust the modal's customId to include the categoryId
		modal.setCustomId(`delgameModal-${categoryName}`);
		//console.log(interaction)
		await interaction.showModal(modal);
	}

	async addGameToCategory(interaction: ModalSubmitInteraction<CacheType>, client: Client, localize: import("src/i18n/i18n-types").TranslationFunctions) {
		const categoryName = interaction.customId.split('-')[1];
		const gameName = interaction.fields.getTextInputValue('add_game_category');
		if (!gameName || gameName.length === 0 || categoryName.length === 0) {
			await interaction.reply({content:'Game couldn\'t be added', ephemeral: true})
			return;
		}
		const categoryRepo = this.db.get(GameCategory)
		const category = await categoryRepo.findOne({ name: categoryName }, { populate: ['games', 'parent'] });
		const gameRepo = this.db.get(Game)
		const game = await gameRepo.findOne({ name: gameName });
		if (!category || !game) {
			//await interaction.reply('Game couldn\'t be added, maybe it does not exist')
			return;
		}
		category.games.add(game);
		categoryRepo.persist(category);
		updateMultipleCategoryEmbeds(category, client, localize, categoryRepo);
		await interaction.reply({content:`Game ${gameName} added to category ${categoryName}`, ephemeral: true});
	}

	async delGameFromCategory(interaction: ModalSubmitInteraction<CacheType>, client: Client, localize: import("src/i18n/i18n-types").TranslationFunctions) {
		const categoryName = interaction.customId.split('-')[1];
		const gameName = interaction.fields.getTextInputValue('del_game_category');
		if (!gameName || gameName.length === 0 || categoryName.length === 0) {
			await interaction.reply({content: 'Game couldn\'t be removed', ephemeral: true})
			return;
		}
		const categoryRepo = this.db.get(GameCategory)
		categoryRepo.delGameFromCategory(categoryName, gameName);
		updateAllCategoryEmbeds(categoryRepo, client, localize);
		await interaction.reply({content:`Game ${gameName} removed from category ${categoryName}`, ephemeral: true});
	}
}