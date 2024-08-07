/* eslint-disable */
import type { Translation } from '../i18n-types'

const uk = {
	GUARDS: {
		DISABLED_COMMAND: 'Ця команда на разі відключена',
		MAINTENANCE: 'На разі ведуться технічні роботи!',
		GUILD_ONLY: 'Цю команду можна використовувати тільки на сервері!',
		NSFW: 'Ця команда може бути використана тільки в каналі для дорослих!',
		ROLE: 'You do not have the required role to use this command.',
	},
	ERRORS: {
		UNKNOWN: 'Сталася невідома помилка!',
		AEXIST: '{name} already exist.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Опис відсутній.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Запросити бота до себе додому!',
			EMBED: {
				TITLE: 'Запроси мене до себе на сервер!',
				DESCRIPTION: '[Тисни тут]({link}) щоб я мав доступ!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Змінити префікс команд.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'Новий префікс для команд боту.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Префікс змінено на `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Встановити режим проведення технічних робіт.',
			EMBED: {
				DESCRIPTION: 'Режим технічних робіт встановлено на `{state}`.',
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
				CATEGORY: {
					NAME: 'category',
					DESCRIPTION: 'The type of game to play.',
				},
			},
		},
		STATS: {
			DESCRIPTION: 'Подивитись статистику бота.',
			HEADERS: {
				COMMANDS: 'Команди',
				GUILDS: 'Гільдії',
				ACTIVE_USERS: 'Активні користувачі',
				USERS: 'Користувачі',
			},
		},
		HELP: {
			DESCRIPTION: 'Загальна допомога по боту та його командам',
			EMBED: {
				TITLE: 'Панель допомоги',
				CATEGORY_TITLE: '{category} команди',
			},
			SELECT_MENU: {
				TITLE: 'Вибери категорію',
				CATEGORY_DESCRIPTION: '{category} команди',
			},
		},
		PING: {
			DESCRIPTION: "Перевірка зв'язку!",
			MESSAGE: '{member} Чути добре! Генерація повідомлення зайняла {time} мілісекунд. {heartbeat}',
		},
	},
} satisfies Translation

export default uk
