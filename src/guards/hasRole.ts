import { GuardFunction } from "discordx";
import { CommandInteraction, GuildMember } from "discord.js";
import { SimpleCommandMessage } from "discordx";
import { replyToInteraction } from "@/utils/functions";
import { L, getLocaleFromInteraction } from "@/i18n";

export function HasRole(roleName: string): GuardFunction<CommandInteraction | SimpleCommandMessage> {
	return async (arg, client, next) => {
		let member: GuildMember | null = null;

		if (arg instanceof CommandInteraction) {
		member = arg.member as GuildMember;
		} else if (arg instanceof SimpleCommandMessage) {
		member = arg.message.member as GuildMember;
		}

		if (member && member.roles.cache.some(role => role.name === roleName)) {
			return next();
		} else {
			await replyToInteraction(arg, L[getLocaleFromInteraction(arg)].GUARDS.ROLE())
		}
	};
}