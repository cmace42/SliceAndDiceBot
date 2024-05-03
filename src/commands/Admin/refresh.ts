import { Category } from '@discordx/utilities'
import { CommandInteraction, EmbedBuilder, EmbedField, TextChannel} from 'discord.js'
import { Client } from 'discordx'
import { TranslationFunctions } from 'src/i18n/i18n-types'

import { Discord, Injectable, Slash } from '@/decorators'
import { Guard, UserPermissions } from '@/guards'
import { Database } from '@/services'
import games_list from 'assets/files/list.json'
import { getColor } from '@/utils/functions'
import { Game } from '@/entities'

type GameType = {
	name: string,
	proprio: string | null,
	timemin: number | null,
	timemax: number | null,
	nbrmin: number | null,
	nbrmax: number | null,
	description: string | null,
	available: boolean | null,
	jdr: boolean | null
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function timeToString(time: number | null) {
	if (!time) {
		return null
	}
	
	let res:string = ""
	
	const minutes:number = (time % 60)

	if (time >= 60) {
		const hours:number = (time - minutes) / 60;
		res = hours.toString() + 'h'
	}
	
	res += minutes.toString() + 'min'
	return res;
}

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
		let embed = await this.getEmbed({ client, interaction, game, locale })
		//Check if game already in database
		let gamedata = await this.db.get(Game).findOne({name:game.name})
		//console.log(gamedata)
		//console.log(game)
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
		//console.log(gamedata)
		//await delay(1000)
	}

	private async getEmbed({ client, interaction, game, locale }: {
		client: Client
		interaction: CommandInteraction
		game: GameType
		locale: TranslationFunctions
	}): Promise<EmbedBuilder> {
		const descr:string = game.description || "Missing description."
		const embed = new EmbedBuilder()
			.setTitle(game.name)
			.setColor(getColor('primary'))
			.setDescription(descr)
		const fields: EmbedField[] = []
		/**
		 * Owner field
		 */
		fields.push({
				name: locale.COMMANDS.REFRESH.EMBED.OWNER(),
				value: `\`${game.proprio || locale.COMMANDS.REFRESH.EMBED.UNKNOWN()}\``,
				inline: true,
		})
		/**
		 * Player count field
		 */
		const nbrmin:string = game.nbrmin?.toString() || locale.COMMANDS.REFRESH.EMBED.UNKNOWN()
		const nbrmax:string = game.nbrmax?.toString() || locale.COMMANDS.REFRESH.EMBED.UNKNOWN()
		fields.push({
			name: locale.COMMANDS.REFRESH.EMBED.NBRJ(),
			value: locale.COMMANDS.REFRESH.EMBED.BETWEEN({var1:nbrmin, var2:nbrmax}),
			inline: true,
		})
		/**
		 * Expected Time field
		 */
		const timemin:string = timeToString(game.timemin) || locale.COMMANDS.REFRESH.EMBED.UNKNOWN()
		const timemax:string = timeToString(game.timemax) || locale.COMMANDS.REFRESH.EMBED.UNKNOWN()
		fields.push({
			name: locale.COMMANDS.REFRESH.EMBED.TIME(),
			value: locale.COMMANDS.REFRESH.EMBED.BETWEEN({var1:timemin, var2:timemax}),
			inline: true,
		})
		if (game.available)
			// add the fields to the embed
			embed.addFields(fields)
		else
			embed.setDescription(locale.COMMANDS.REFRESH.EMBED.UNAVAILABLE())
		return embed
	}

}
