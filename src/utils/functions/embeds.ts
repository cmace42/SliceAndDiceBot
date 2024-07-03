import { CommandInteraction, EmbedBuilder, EmbedField } from 'discord.js'

import { replyToInteraction } from '@/utils/functions'
import { TranslationFunctions } from 'src/i18n/i18n-types'
import { getColor } from '@/utils/functions'
import { Category, CategoryRepository } from '@/entities'

const testCategoryChannel = 'https://discord.com/channels/1233081092416999515/1256159215332888617/';
const listgamesChannel = 'https://discord.com/channels/710524520724824175/1103703411985227917/';

export type GameType = {
	name: string,
	proprio: string | null,
	timemin: number | null,
	timemax: number | null,
	nbrmin: number | null,
	nbrmax: number | null,
	description: string | null,
	available: boolean | null,
	jdr: boolean | null,
	messageID: string | null
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
	const descr:string = game.description || locale.SHARED.NO_COMMAND_DESCRIPTION()
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
			value: game.proprio || locale.COMMANDS.REFRESH.EMBED.UNKNOWN(),
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


export async function CategoryEmbed({ category, locale, categoryRepo, isNew = false }: {
    category: Category
    locale: TranslationFunctions
    categoryRepo: CategoryRepository
	isNew: boolean
}): Promise<EmbedBuilder> {
    let descr = category.description || locale.SHARED.NO_COMMAND_DESCRIPTION()

    const embed = new EmbedBuilder()
        .setTitle(category.name)
        .setColor(getColor('primary'))
        .setDescription(descr)

    // Check if the category has a parent and add a field with a Discord link to the parent category's message
    if (category.parent) {
		if (!category.parent.messageID)
			category.parent = await categoryRepo.findOneOrFail({ id: category.parent.id });
		const parentCategoryLink = `${testCategoryChannel}${category.parent.messageID}`;
		embed.addFields({
			name: locale.COMMANDS.ADD_CATEGORY.EMBED.PARENT(),
			value: locale.COMMANDS.ADD_CATEGORY.EMBED.LINK({name:category.parent.name, link:parentCategoryLink}),
			inline: false
		});
    }
	let gamesLinks = null;
	if (!isNew) {
		const games: GameType[] = await categoryRepo.findAllGamesInCategory(category.id)
		if (games.length !== 0) {
			const gameNames = games.map(game =>  {
				if (!game.messageID)
					return game.name;
				const gameLink = `${listgamesChannel}${game.messageID}`;
				return `[${game.name}](${gameLink})`;
			}).join('\n');
			gamesLinks = gameNames;
		}
	}
	embed.addFields({
		name: locale.COMMANDS.ADD_CATEGORY.EMBED.GAMES(),
		value: gamesLinks || locale.SHARED.NO_COMMAND_DESCRIPTION(),
		inline: true
	});

    const childrenCategories: Category[] = category.children.getItems();
    if (childrenCategories.length > 0) {
		let childrenLinks = childrenCategories.map(child => {
			const childCategoryLink = `${testCategoryChannel}${child.messageID}`;
			return locale.COMMANDS.ADD_CATEGORY.EMBED.LINK({name:child.name, link:childCategoryLink});
		}).join('\n');
		embed.addFields({ name: locale.COMMANDS.ADD_CATEGORY.EMBED.CHILDREN(), value: childrenLinks, inline: false });
    }


    return embed;
}