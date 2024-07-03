/* eslint-disable */
import type { Translation } from '../i18n-types'

const ru = {
	GUARDS: {
		DISABLED_COMMAND: 'Эта команда на данный момент не доступна.',
		MAINTENANCE: 'Бот закрыт на техническое обслуживание.',
		GUILD_ONLY: 'Эту команду можно использовать только на сервере.',
		NSFW: 'Эта команда доступна только в чатах 18+.',
		ROLE: 'You do not have the required role to use this command.',
	},
	ERRORS: {
		UNKNOWN: 'Произошла непонятная ошибка.',
		AEXIST: '{name} already exist.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Описание отсутствует.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Пригласить бота на свой сервер!',
			EMBED: {
				TITLE: 'Хочешь видеть меня у себя на сервере?',
				DESCRIPTION: '[Жми здесь]({link}) чтобы добавить бота!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Изменить префикс для бота.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'Новый префикс для бота.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Префикс бота изменен на `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Установить режим технического обслуживания бота.',
			EMBED: {
				DESCRIPTION: 'Режим Технического Обслуживания установлен на `{state}`.',
			},
		},
		REFRESH: {
			DESCRIPTION: 'Refresh the list of games.',
			EMBED: {
				OWNER: 'Owner',
				NBRJ: 'Number of players',
				TIME: 'Expected playtime',
				BETWEEN: 'Between {var1} and {var2}',
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
				CHILDREN: 'Children Categories',
				LINK: '[Go to {name}]({link})',
				DESCRIPTION: 'Category successfully added.',
			},
		},
		SEARCH: {
			DESCRIPTION: "Search for available games with the group's preferences.",
			OPTIONS: {
				TIMEMIN: {
					NAME: 'timemin',
					DESCRIPTION: 'The expected play time minimum.',
				},
				TIMEMAX: {
					NAME: 'timemax',
					DESCRIPTION: 'The expected play time maximum.',
				},
				NBR: {
					NAME: 'nbr',
					DESCRIPTION: 'The number of players.',
				},
			},
		},
		STATS: {
			DESCRIPTION: 'Получить статистику по боту.',
			HEADERS: {
				COMMANDS: 'Команды',
				GUILDS: 'Сервера',
				ACTIVE_USERS: 'Активные пользователи',
				USERS: 'Пользователи',
			},
		},
		HELP: {
			DESCRIPTION: 'Глобальная справка по боту и его командам',
			EMBED: {
				TITLE: 'Панель помощи',
				CATEGORY_TITLE: '{category} команды',
			},
			SELECT_MENU: {
				TITLE: 'Выбери категорию',
				CATEGORY_DESCRIPTION: '{category} команды',
			},
		},
		PING: {
			DESCRIPTION: 'Тук-тук!',
			MESSAGE: '{member} Что нужно? Было потрачено {time} милисекунд на генерацию ответа. {heartbeat}',
		},
	},
} satisfies Translation

export default ru
