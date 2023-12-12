import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs";

export default class MessagesCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "messages",
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
		await this.messages();
	}

	private async messages(): Promise<any> {
		const messageStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/message_statistics.json").toString());
		const messagesCount: number = messageStatisticsFile?.count || 0;
		if(!messageStatisticsFile.userMessages){
			const embed: EmbedBuilder = this.client.createEmbed(
				"Es wurde heute noch keine Nachricht geschrieben",
				"error",
				"normal"
			);
			return this.interaction.followUp({ embeds: [embed] });
		}
		const writers: number = Object.keys(messageStatisticsFile?.userMessages).length || 0;
		const mostActiveUser: any = Object.keys(messageStatisticsFile.userMessages).reduce((a: any, b: any) =>
			messageStatisticsFile.userMessages[a] > messageStatisticsFile.userMessages[b] ? a : b
		);
		const messagesEmbed: EmbedBuilder = this.client.createEmbed(
			"Heute wurden bisher **{0} Nachrichten** von **{1} Menschen** geschrieben! Bisher ist <@{2}> der Aktivste! Danke für eure Aktivität <3",
			"arrow",
			"normal",
			messagesCount,
			writers,
			mostActiveUser
		);
		return this.interaction.followUp({ embeds: [messagesEmbed] });
	}
}
