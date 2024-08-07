/* eslint-disable */
import type { Translation } from '../i18n-types'

const fr = {
	GUARDS: {
		DISABLED_COMMAND: 'Cette commande est désactivée.',
		MAINTENANCE: 'Ce bot est en mode maintenance.',
		GUILD_ONLY: "Cette commande ne peut être utilisée qu'en serveur.",
		NSFW: 'Cette commande ne peut être utilisée que dans un salon NSFW.',
		ROLE: 'Vous ne possèdez pas le rôle nécessaire pour exécuter cette commande.',
	},
	ERRORS: {
		UNKNOWN: 'Une erreur est survenue.',
		AEXIST: '{name} existe déjà.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Aucune description fournie.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Invitez le bot sur votre serveur!',
			EMBED: {
				TITLE: 'Invite moi sur ton serveur!',
				DESCRIPTION: "[Clique ici]({link}) pour m'inviter!",
			},
		},
		PREFIX: {
			NAME: 'prefixe',
			DESCRIPTION: 'Change le préfix du bot.',
			OPTIONS: {
				PREFIX: {
					NAME: 'nouveau_prefix',
					DESCRIPTION: 'Le nouveau préfix du bot.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefix changé en `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Met le mode maintenance du bot.',
			EMBED: {
				DESCRIPTION: 'Le mode maintenance a été définie à `{state}`.',
			},
		},
		REFRESH: {
			DESCRIPTION: 'Actualise la liste des jeux.',
			EMBED: {
				OWNER: 'Proprio',
				NBRJ: 'Nombre de joueurs',
				TIME: 'Temps de jeu',
				BETWEEN: 'Entre {var1} et {var2}',
				UNKNOWN: 'Inconnu',
				UNAVAILABLE: 'Actuellement indisponible.',
			},
		},
		EDIT: {
			DESCRIPTION: 'Modifier un jeu existant.',
			OPTIONS: {
				NAME: {
					NAME: 'nom',
					DESCRIPTION: 'Le nom du jeu à modifier.',
				},
				NEWNAME: {
					NAME: 'nouveau_nom',
					DESCRIPTION: 'Le nouveau nom du jeu.',
				},
				OWNER: {
					NAME: 'proprio',
					DESCRIPTION: 'Le propriétaire du jeu.',
				},
				TIMEMIN: {
					NAME: 'tempsmin',
					DESCRIPTION: 'Le temps de jeu minimum.',
				},
				TIMEMAX: {
					NAME: 'tempsmax',
					DESCRIPTION: 'Le temps de jeu maximum.',
				},
				NBRMIN: {
					NAME: 'nbrmin',
					DESCRIPTION: 'Le nombre minimum de joueurs.',
				},
				NBRMAX: {
					NAME: 'nbrmax',
					DESCRIPTION: 'Le nombre maximum de joueurs.',
				},
				DESCRIPTION: {
					NAME: 'description',
					DESCRIPTION: 'La description du jeu.',
				},
				AVAILABLE: {
					NAME: 'disponibilité',
					DESCRIPTION: 'Le jeu est-il actuellement à 42 ?',
				},
			},
		},
		ADD_CATEGORY: {
			DESCRIPTION: 'Ajouter une catégorie de jeu.',
			OPTIONS: {
				NAME: {
					NAME: 'nom',
					DESCRIPTION: 'Le nom de la catégorie à ajouter.',
				},
				PARENT_CATEGORY: {
					NAME: 'catégorie_parent',
					DESCRIPTION: 'La catégorie parente.',
				},
				DESCRIPTION: {
					NAME: 'description',
					DESCRIPTION: 'La description de la catégorie.',
				},
			},
			EMBED: {
				GAMES: 'Jeux',
				PARENT: 'Catégorie mère',
				CHILDREN: 'Catégorie(s) fille(s)',
				LINK: '[Aller à {name}]({link})',
				DESCRIPTION: 'Catégorie ajoutée avec succès.',
			},
		},
		SEARCH: {
			DESCRIPTION: 'Rechecher les jeux disponible suivant les préférences du groupe.',
			OPTIONS: {
				TIMEMIN: {
					NAME: 'tempsmin',
					DESCRIPTION: 'Le temps de jeu minimum.',
				},
				TIMEMAX: {
					NAME: 'tempsmax',
					DESCRIPTION: 'Le temps de jeu maximum.',
				},
				NBR: {
					NAME: 'nbr',
					DESCRIPTION: 'Le nombre de joueurs.',
				},
				CATEGORY: {
					NAME: 'catégorie',
					DESCRIPTION: 'Le genre de jeu.',
				},
			},
		},
		STATS: {
			DESCRIPTION: 'Obtiens des statistiques sur le bot.',
			HEADERS: {
				COMMANDS: 'Commandes',
				GUILDS: 'Serveurs',
				ACTIVE_USERS: 'Utilisateurs actifs',
				USERS: 'Utilisateurs',
			},
		},
		HELP: {
			DESCRIPTION: "Obtenez de l'aide globale sur le bot et ses commandes",
			EMBED: {
				TITLE: "Pannel d'aide",
				CATEGORY_TITLE: 'Commandes de {category}',
			},
			SELECT_MENU: {
				TITLE: 'Sélectionnez une catégorie',
				CATEGORY_DESCRIPTION: 'Commandes de {category}',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member} Pong! Le temps de réponse de la réponse était {time}ms.{heartbeat}',
		},
	},
} satisfies Translation

export default fr
