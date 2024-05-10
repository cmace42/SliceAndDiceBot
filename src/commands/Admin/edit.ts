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
export default class EditCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'edit' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async edit(
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NAME',
			required: true,
			type: ApplicationCommandOptionType.String,
		}) curname: string,
		@SlashOption({
			name: 'newname',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NEWNAME',
			type: ApplicationCommandOptionType.String,
		}) newname: string | undefined,
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
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const gameRepo = this.db.get(Game)
		const gameData = await gameRepo.findOne({ name: curname})
		if (gameData && gameData.messageID) {
			if (newname) {
				if (await gameRepo.findOne({name : newname})) {
					throw new AlreadyExistError(interaction, newname)
				} else {
					gameData.name = newname
				}
			}
			if (proprio)
				gameData.proprio = proprio
			if (timemin)
				gameData.timemin = timemin
			if (timemax)
				gameData.timemax = timemax
			await gameRepo.persistAndFlush(gameData)
			const embed = await GameEmbed({game:gameData, locale:localize})
			const channel = await client.channels.fetch("1103703411985227917");
			if (!channel || !(channel instanceof TextChannel)) {
				interaction.followUp({
					content: 'Channel is badly setup.'
				})
				return ;
			}
			await channel.messages.edit(gameData.messageID, {embeds:[embed]})
			simpleSuccessEmbed(
				interaction, "Game successfully updated."
			)
		} else {
			throw new UnknownReplyError(interaction)
		}
	}

}
