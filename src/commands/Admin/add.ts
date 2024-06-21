import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, TextChannel} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guard, UserPermissions } from '@/guards'
import { Database } from '@/services'
import {  GameType, GameEmbed, simpleSuccessEmbed } from '@/utils/functions'
import { Game } from '@/entities'
import { AlreadyExistError, UnknownReplyError } from '@/errors'

@Discord()
@Injectable()
@Category('Admin')
export default class AddCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'add' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async add(
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NAME',
			required: true,
			type: ApplicationCommandOptionType.String,
		}) curname: string,
		@SlashOption({
			name: 'owner',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.OWNER',
			type: ApplicationCommandOptionType.String,
		}) proprio: string | undefined,
		@SlashOption({
			name: 'timemin',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.TIMEMIN',
			type: ApplicationCommandOptionType.Number,
		}) timemin: number | undefined,
		@SlashOption({
			name: 'timemax',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.TIMEMAX',
			type: ApplicationCommandOptionType.Number,
		}) timemax: number | undefined,
		@SlashOption({
			name: 'nbrmin',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NBRMIN',
			type: ApplicationCommandOptionType.Number,
		}) nbrmin: number | undefined,
		@SlashOption({
			name: 'nbrmax',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NBRMAX',
			type: ApplicationCommandOptionType.Number,
		}) nbrmax: number | undefined,
		@SlashOption({
			name: 'description',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.DESCRIPTION',
			type: ApplicationCommandOptionType.String,
		}) description: string | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const gameRepo = this.db.get(Game)
		let gameData = await gameRepo.findOne({ name: curname})
		if (gameData && gameData.messageID) {
			throw new AlreadyExistError(interaction, curname)
		} else {
			gameData = new Game()
			gameData.name = curname
			if (proprio)
				gameData.proprio = proprio
			if (timemin)
				gameData.timemin = timemin
			if (timemax)
				gameData.timemax = timemax
			if (nbrmax)
				gameData.nbrmax = nbrmax
			if (nbrmin)
				gameData.nbrmin = nbrmin
			if (description)
				gameData.description = description
			const embed = await GameEmbed({game:gameData, locale:localize})
			const channel = await client.channels.fetch("1103703411985227917");
			if (!channel || !(channel instanceof TextChannel)) {
				interaction.followUp({
					content: 'Channel is badly setup.'
				})
				return ;
			}
			let message = await channel.send({embeds:[embed]})
			await message.react('❤')
			.then(() => {if (gameData?.jdr) message.react('🤹')
				message.react('🧑‍🏫')
			.then(() => message.react('🧑‍🎓')
			.then(() => message.react('🤓')
			.then(() => message.react('👀'))))})
			gameData.messageID = message.id
			await gameRepo.persistAndFlush(gameData)
			gameRepo.saveAllEntries()
			simpleSuccessEmbed(
				interaction, "Game successfully added."
			)
		}
	}

}
