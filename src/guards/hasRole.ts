import { GuardFunction } from "discordx";
import { CommandInteraction, GuildMember } from "discord.js";
import { SimpleCommandMessage } from "discordx";

export function HasRole(roleName: string): GuardFunction<CommandInteraction | SimpleCommandMessage> {
  return async (arg, client, next) => {
    let member: GuildMember | null = null;

    if (arg instanceof CommandInteraction) {
      member = arg.member as GuildMember;
    } else if (arg instanceof SimpleCommandMessage) {
      member = arg.message.member as GuildMember;
    }

    if (member && member.roles.cache.some(role => role.name === roleName)) {
      await next();
    } else {
      if (arg instanceof CommandInteraction) {
        await arg.reply({ content: "You do not have the required role to use this command.", ephemeral: true });
      } else if (arg instanceof SimpleCommandMessage) {
        await arg.message.reply("You do not have the required role to use this command.");
      }
    }
  };
}