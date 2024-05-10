import { CommandInteraction } from 'discord.js'

import { getLocaleFromInteraction, L } from '@/i18n'
import { BaseError } from '@/utils/classes'
import { simpleErrorEmbed } from '@/utils/functions'

export class AlreadyExistError extends BaseError {

	private interaction: CommandInteraction
	private what: string

	constructor(interaction: CommandInteraction, what:string, message?: string) {
		super(message)

		this.interaction = interaction
		this.what = what
	}

	handle() {
		const locale = getLocaleFromInteraction(this.interaction)
		simpleErrorEmbed(this.interaction, L[locale].ERRORS.AEXIST({name:this.what}))
	}

}
