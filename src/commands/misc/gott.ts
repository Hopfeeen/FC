import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class GottCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "gott",
			description: "On the 8 Day",
			localizedDescriptions: {
				de: "Am 8. Tag"
			},
			cooldown: 1000,
			dirname: __dirname,
			slashCommand: {
				addCommand: true,
				data: new SlashCommandBuilder()
			}
		});
	}

	public async dispatch(interaction: any, data: any): Promise<void> {
		this.interaction = interaction;
		this.guild = interaction.guild;
		await this.gott();
	}

	private async gott(): Promise<any> {
		const gottEmbed: EmbedBuilder = this.client.createEmbed(
			"### Am 8. Tag schuff ers...",
			null,
			"normal"
		);
		gottEmbed.setImage(
			"https://cdn.discordapp.com/attachments/1116797977432961197/1177678231185403964/bopp_19_12693-scaled.png?ex=65736152&is=6560ec52&hm=b2993fb96b7f19d20bd45149c2a5ffe00a2bc187c9a073670ab0a0798bbebd91"
		);
		return this.interaction.followUp({ embeds: [gottEmbed] });
	}
}
