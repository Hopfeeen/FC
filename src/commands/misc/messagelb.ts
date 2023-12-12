import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs";

export default class MessagelbCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "messageslb",
			description: "Show how much messages had been send",
			localizedDescriptions: {
				de: "Zeige wie viele Nachrichten gesendet wurden"
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
		await this.messageLeaderboard();
	}

	private async messageLeaderboard(): Promise<any> {
		const messageStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/message_statistics.json").toString());

		const mostActiveUsers: any[] = Object.entries(messageStatisticsFile.userMessages)
			.sort((a: any, b: any) => b[1] - a[1])
			.slice(0, 10);

		const leaderboardEmbed: EmbedBuilder = this.client.createEmbed(
			"Die aktivsten Leute heute \n {0}",
			"text",
			"normal",
			mostActiveUsers
				.map(
					([id, count]: any): string => this.client.emotes.arrow + ` **<@${id}> | ${count}** Messages`
				)
				.join("\n")
		);
		return this.interaction.followUp({ embeds: [leaderboardEmbed] });
	}
}
