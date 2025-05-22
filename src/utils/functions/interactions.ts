import { CommandInteraction, RepliableInteraction } from 'discord.js'
import { SimpleCommandMessage } from 'discordx'

/**
 * Abstraction level to reply to either a slash command or a simple command message.
 * @param interaction
 * @param message
 */
export async function replyToInteraction(interaction: RepliableInteraction | CommandInteraction | SimpleCommandMessage, message: string | { [key: string]: any }) {
	if (interaction instanceof SimpleCommandMessage)
		await interaction.message.reply(message)
	else if (interaction instanceof CommandInteraction)
		await interaction.followUp(message)
	else
		await interaction.reply(message)
}
