import BaseCommand from "@structures/BaseCommand";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient";

export default class zitat extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "zitat",
			description: "A zitat",
			localizedDescriptions: {
				de: "Ein tolles Zitat"
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
		await this.zitat();
	}

	private async zitat(question: string): Promise<any> {
		const randomZitat: any = this.translate("zitat2");
		const randomZitat2: string = randomZitat[Math.floor(Math.random() * randomZitat.length)];
		const text: string = this.client.emotes.arrow + " " + randomZitat2;
		const eightBallEmbed: EmbedBuilder = this.client.createEmbed(text, null, "normal");
		return this.interaction.followUp({ embeds: [eightBallEmbed] });
	}
}