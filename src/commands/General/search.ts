import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, ButtonInteraction, EmbedBuilder} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guard, HasRole, UserPermissions } from '@/guards'
import { Database } from '@/services'
import {  GameType, GameEmbed, simpleSuccessEmbed, simpleErrorEmbed } from '@/utils/functions'
import { Game } from '@/entities'
import { AlreadyExistError, UnknownReplyError } from '@/errors'
import { Pagination, PaginationType } from '@discordx/pagination'

function chunkArray(arr: EmbedBuilder[], size: number): EmbedBuilder[][] {
    return arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr];
}

@Discord()
@Injectable()
@Category('General')
export default class SearchCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'search' })
	@Guard()
	async search(
		/* Maybe search for regex by name or containing keyword like clank ?
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NAME',
			type: ApplicationCommandOptionType.String,
		}) curname: string,
		 */
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
			name: 'nbr',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NBRMIN',
			type: ApplicationCommandOptionType.Number,
		}) nbr: number | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const gameRepo = this.db.get(Game);
		let games = await gameRepo.find({
			...(timemin !== undefined && { timemin: { $gte: timemin } }), // gametimemin >= timemin
			...(timemax !== undefined && { timemax: { $lte: timemax } }), // gametimemax <= timemax
			...(nbr !== undefined && { nbrmin: { $lte: nbr } }), // gamenbrmin >= nbrmin
			...(nbr !== undefined && { nbrmax: { $gte: nbr } }), // gamenbrmax <= nbrmax
		});
		if (games.length === 0) { // Corrected check for empty array
			simpleErrorEmbed(interaction, "No games correspond to those options.");
		} else {
			// Transform each game into a GameEmbed promise
			let embedPromises = games.map(game => GameEmbed({ game, locale: localize }));
			// Wait for all promises to resolve
			let embeds = await Promise.all(embedPromises);
			const totalEmbeds = embeds.length;

			if (totalEmbeds > 7) {
				// Chunk the embeds into groups of 4
				const embedChunks = chunkArray(embeds, 4);

				// Initialize Pagination with the chunks and include content indicating the range of embeds
				const pages = embedChunks.map((chunk, index) => {
					// Calculate start and end numbers for the current chunk
					const start = index * 4 + 1;
					const end = start + chunk.length - 1;
					const content = `${start}-${end} / ${totalEmbeds}`;
					return { content, embeds: chunk };
				});
				
				await new Pagination(
					interaction,
					pages,
					{
						type: PaginationType.Button,
						time: 60000,
					}
				).send()
			} else {
				await interaction.followUp({ embeds });
			}
			
			simpleSuccessEmbed(interaction, "Search ended successfully.");
		}
	}

}


/* When categories will be implemented

@SlashOption({
    name: 'category',
    localizationSource: 'COMMANDS.EDIT.OPTIONS.CATEGORY',
    type: ApplicationCommandOptionType.String,
}) category: string | undefined,


async function searchGames() {
    const gameRepo = this.db.get(Game);
    let qb = gameRepo.createQueryBuilder('g'); // 'g' is an alias for the game table

    // Apply filters for game attributes
    if (timemin !== undefined) {
        qb.andWhere({ timemin: { $gt: timemin } });
    }
    if (timemax !== undefined) {
        qb.andWhere({ timemax: { $lt: timemax } });
    }
    if (nbrmin !== undefined) {
        qb.andWhere({ nbrmin: { $gt: nbrmin } });
    }
    if (nbrmax !== undefined) {
        qb.andWhere({ nbrmax: { $lt: nbrmax } });
    }

    // Join with the category mapping table and filter by category if specified
    if (category !== undefined) {
        qb.joinAndSelect('g.categories', 'c') // Assuming 'g.categories' is the relation path
          .andWhere('c.name = :category', { category }); // Adjust based on your category identifier
    }

    let games = await qb.getResultList();

    if (games.length === 0) {
        simpleErrorEmbed(interaction, "No games correspond to those options.");
    } else {
        let embedPromises = games.map(game => GameEmbed({ game, locale: localize }));
        let embeds = await Promise.all(embedPromises);
        await interaction.followUp({ embeds: embeds });
        simpleSuccessEmbed(interaction, "Search ended successfully.");
    }
} */