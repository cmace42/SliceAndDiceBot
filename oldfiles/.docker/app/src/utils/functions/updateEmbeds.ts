import { Client, CommandInteraction, TextChannel, EmbedBuilder, BaseInteraction } from 'discord.js';
import { Category, CategoryRepository } from '@/entities'; // Adjust the import path as necessary
import { CategoryEmbed } from './embeds';
import { TranslationFunctions } from 'src/i18n/i18n-types';

export async function updateCategoryEmbed(category: Category, client: Client, locale: TranslationFunctions, categoryRepo: CategoryRepository) {
  const embed = await CategoryEmbed({ category, locale, categoryRepo, isNew: false }); 
  const channel = await client.channels.fetch('1258379271156535406') as TextChannel;
  await channel.messages.edit(category.messageID, { embeds: [embed] }); // Edit the message with the new embed
}

export async function updateMultipleCategoryEmbeds(
	parentCategory: Category | null, client: Client, locale: TranslationFunctions, categoryRepo: CategoryRepository
) {
  if (parentCategory) {
	await categoryRepo.populate(parentCategory, ['games', 'parent']);
	await updateCategoryEmbed(parentCategory, client, locale, categoryRepo);
	if (parentCategory.parent) {
		await updateMultipleCategoryEmbeds(parentCategory.parent, client, locale, categoryRepo);
	}
  }
}

export async function updateAllCategoryEmbeds(categoryRepo: CategoryRepository, client: Client, locale: TranslationFunctions) {
  const categories = await categoryRepo.findAll({ populate: ['games', 'parent', 'children'] });
  for (const category of categories) {
    await updateCategoryEmbed(category, client, locale, categoryRepo);
  }
}