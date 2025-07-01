/* eslint-disable */
import type { BaseTranslation } from '../i18n-types'

const en = {
	GUARDS: {
		DISABLED_COMMAND: 'This command is currently disabled.',
		MAINTENANCE: 'This bot is currently in maintenance mode.',
		GUILD_ONLY: 'This command can only be used in a server.',
		NSFW: 'This command can only be used in a NSFW channel.',
		ROLE: 'You do not have the required role to use this command.',
	},
	ERRORS: {
		UNKNOWN: 'An unknown error occurred.',
		AEXIST: '{name:string} already exist.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'No description provided.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Invite the bot to your server!',
			EMBED: {
				TITLE: 'Invite me on your server!',
				DESCRIPTION: '[Click here]({link}) to invite me!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Change the prefix of the bot.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'The new prefix of the bot.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefix changed to `{prefix:string}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Set the maintenance mode of the bot.',
			EMBED: {
				DESCRIPTION: 'Maintenance mode set to `{state:string}`.',
			},
		},
		REFRESH: {
			DESCRIPTION: 'Refresh the list of games.',
			EMBED: {
				OWNER: 'Owner',
				NBRJ: 'Number of players',
				TIME: 'Expected playtime',
				BETWEEN: 'Between {var1:string} and {var2:string}',
				UNKNOWN: 'Unknown',
				UNAVAILABLE: 'Currently Unavailable.',
			},
		},
		EDIT: {
			DESCRIPTION: 'Edit an existing game.',
			OPTIONS: {
				NAME: {
					NAME: 'name',
					DESCRIPTION: 'The name of the game to be edited.',
				},
				NEWNAME: {
					NAME: 'newname',
					DESCRIPTION: 'The new name of the game.',
				},
				OWNER: {
					NAME: 'owner',
					DESCRIPTION: 'The owner of the game.',
				},
				TIMEMIN: {
					NAME: 'timemin',
					DESCRIPTION: 'The expected play time minimum.',
				},
				TIMEMAX: {
					NAME: 'timemax',
					DESCRIPTION: 'The expected play time maximum.',
				},
				NBRMIN: {
					NAME: 'nbrmin',
					DESCRIPTION: 'The minimum number of players.',
				},
				NBRMAX: {
					NAME: 'nbrmax',
					DESCRIPTION: 'The maximum number of players.',
				},
				DESCRIPTION: {
					NAME: 'description',
					DESCRIPTION: 'The description of the game.',
				},
				AVAILABLE: {
					NAME: 'available',
					DESCRIPTION: 'Is the game still at 42 ?',
				},
			},
		},
		ADD_CATEGORY: {
			DESCRIPTION: 'Add a category for games.',
			OPTIONS: {
				NAME: {
					NAME: 'name',
					DESCRIPTION: 'The name of the category to add.',
				},
				PARENT_CATEGORY: {
					NAME: 'parent_category',
					DESCRIPTION: 'The parent category if there is one.',
				},
				DESCRIPTION: {
					NAME: 'description',
					DESCRIPTION: 'A definition of the category name.',
				},
			},
			EMBED: {
				GAMES: 'Games',
				PARENT: 'Parent Category',
				CHILDREN: 'Children Categorie(s)',
				LINK: '[Go to {name:string}]({link:string})',
				DESCRIPTION: 'Category successfully added.',
			},
		},
		SEARCH: {
			DESCRIPTION: "Search for available games with the group's preferences.",
			OPTIONS: {
				TIMEMIN: {
					NAME: 'timemin',
					DESCRIPTION: 'The minimum expected play time.',
				},
				TIMEMAX: {
					NAME: 'timemax',
					DESCRIPTION: 'The maximum expected play time.',
				},
				NBR: {
					NAME: 'nbr',
					DESCRIPTION: 'The number of players.',
				},
				CATEGORY: {
					NAME: 'category',
					DESCRIPTION: 'The type of game to play.',
				},
			},
		},
		STATS: {
			DESCRIPTION: 'Get some stats about the bot.',
			HEADERS: {
				COMMANDS: 'Commands',
				GUILDS: 'Guild',
				ACTIVE_USERS: 'Active Users',
				USERS: 'Users',
			},
		},
		HELP: {
			DESCRIPTION: 'Get global help about the bot and its commands',
			EMBED: {
				TITLE: 'Help panel',
				CATEGORY_TITLE: '{category:string} Commands',
			},
			SELECT_MENU: {
				TITLE: 'Select a category',
				CATEGORY_DESCRIPTION: '{category:string} commands',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member:string} Pong! The message round-trip took {time:number}ms.{heartbeat:string}',
		},
	},
} satisfies BaseTranslation

export default en
