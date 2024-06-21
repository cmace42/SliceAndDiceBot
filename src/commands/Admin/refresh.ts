import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder, EmbedField, TextChannel} from 'discord.js'
import { Client } from 'discordx'
import { TranslationFunctions } from 'src/i18n/i18n-types'

import { Discord, Injectable, Slash } from '@/decorators'
import { Guard, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { Game } from '@/entities'
import { GameType, GameEmbed } from '@/utils/functions'
import games_list from '../../../assets/files/update.json';

@Discord()
@Injectable()
@Category('Admin')
export default class RefreshCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'refresh' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async refresh(
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		/**/
		let allembed:Array<EmbedBuilder> = []
		const channel = await client.channels.fetch("1103703411985227917");
		if (!channel || !(channel instanceof TextChannel)) {
			interaction.followUp({
				content: 'Channel is badly setup.'
			})
			return ;
		}
		try {
			games_list.forEach(async (game:GameType) =>
				await this.refreshGame({ client, interaction, game, locale: localize, channel })
			)
			this.db.get(Game).saveAllEntries()
			interaction.followUp({
				content: 'Games refreshed'
			})
		} catch (error) {
			console.log(error)
			interaction.followUp({
				content: 'An error occured'
			})
		}
	}

	private async refreshGame({ client, interaction, game, locale, channel }: {
		client: Client
		interaction: CommandInteraction
		game: GameType
		locale: TranslationFunctions
		channel: TextChannel
	}) {
		let embed = await GameEmbed({ game, locale })
		//Check if game already in database
		let gamedata = await this.db.get(Game).findOne({name:game.name})
		console.log(gamedata)
		console.log(game)
		if (!gamedata)
			gamedata = new Game() // inserting new game
		if (!gamedata.messageID) { // create new message
			let message = await channel.send({embeds:[embed]})
			await message.react('❤')
			.then(() => {if (game.jdr) message.react('🤹')
				message.react('🧑‍🏫')
			.then(() => message.react('🧑‍🎓')
			.then(() => message.react('🤓')
			.then(() => message.react('👀'))))})
			gamedata.messageID = message.id
		} else { // edit existing message
			await channel.messages.edit(gamedata.messageID, {embeds:[embed]})
		}
		Object.assign(gamedata, game)
		await this.db.get(Game).persistAndFlush(gamedata)
		console.log(gamedata)
		//await delay(1000)
	}

}
