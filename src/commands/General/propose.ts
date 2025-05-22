import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction} from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, On, Slash, SlashChoice, SlashOption } from '@/decorators'
import { Guard, HasRole, UserPermissions } from '@/guards'
import { Database } from '@/services'
import {  GameType, GameEmbed, simpleSuccessEmbed, simpleErrorEmbed } from '@/utils/functions'
import { Game, Category as GameCategory } from '@/entities'
import { Pagination, PaginationType } from '@discordx/pagination'
import games_list from '../../../assets/files/saveid.json'

@Discord()
@Injectable()
@Category('General')
export default class ProposeCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'propose' })
	@Guard()
	async propose(
		@SlashOption({
			name: 'name',
			localizationSource: 'COMMANDS.EDIT.OPTIONS.NAME',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		}) curname: string,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const gameRepo = this.db.get(Game);
		let game = await gameRepo.findOne({ name: curname });
		if (!game) { // Corrected check for empty array
			console.log("No such game.");
			console.log(curname);
			//simpleErrorEmbed(interaction, "No such game.");
		} else {
			console.log(curname);
			let embed = await GameEmbed({ game, locale: localize, toLink: true });
			
		}
	}

	@On("autocomplete")
	async onAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
		console.log("Autocomplete");
		if (interaction.commandName === "propose") {
			console.log("Autocomplete2");
		const focusedOption = interaction.options.getFocused(true);
		const names = games_list.map(game => game.name)
		const filtered = names.filter(name => 
			name.toLowerCase().includes(focusedOption.value.toLowerCase())
		);
		
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		);
		}
	}

}


/* When categories will be implemented

@SlashOption({
    name: 'category',
    localizationSource: 'COMMANDS.EDIT.OPTIONS.CATEGORY',
    type: ApplicationCommandOptionType.String,
}) category: string | undefined,


async function proposeGames() {
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
        simpleSuccessEmbed(interaction, "Propose ended successfully.");
    }
} */