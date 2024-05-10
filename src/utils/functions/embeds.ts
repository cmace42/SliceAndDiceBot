import { CommandInteraction, EmbedBuilder, EmbedField } from 'discord.js'

import { replyToInteraction } from '@/utils/functions'
import { TranslationFunctions } from 'src/i18n/i18n-types'
import { getColor } from '@/utils/functions'

export type GameType = {
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

/**
 * Send a simple success embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleSuccessEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0x57F287) // GREEN // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`✅ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
}

/**
 * Send a simple error embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleErrorEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0xED4245) // RED // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`❌ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
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

export async function GameEmbed({ game, locale }: {
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