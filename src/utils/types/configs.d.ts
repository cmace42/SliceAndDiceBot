interface GeneralConfigType {

	name: string
	description: string
	defaultLocale: import('@/i18n').Locales
	ownerId: string
	timezone: string
	automaticUploadImagesToImgur: boolean

	simpleCommandsPrefix: string
	automaticDeferring: boolean

	links: {
		invite: string
		supportServer: string
		gitRemoteRepo: string
	}

	devs: string[]

	eval: {
		name: string
		onlyOwner: boolean
	}

	activities: {
		text: string
		type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM' | 'COMPETING'
	}[]

}

interface DatabaseConfigType {

	path: `${string}/`

	backup: {
		enabled: boolean
		path: `${string}/`
	}
}

interface LogsConfigType {

	debug: boolean
	logTailMaxSize: number

	archive: {
		enabled: boolean
		retention: number
	}

	interaction: {
		file: boolean
		console: boolean
		channel: string | null

		exclude: InteractionsConstants[]
	}

	simpleCommand: {
		file: boolean
		console: boolean
		channel: string | null
	}

	newUser: {
		file: boolean
		console: boolean
		channel: string | null
	}

	guild: {
		file: boolean
		console: boolean
		channel: string | null
	}

	error: {
		file: boolean
		console: boolean
		channel: string | null
	}
}

interface StatsConfigType {

	interaction: {

		exclude: InteractionsConstants[]
	}
}

interface APIConfigType {

	enabled: boolean
	port: number
}
