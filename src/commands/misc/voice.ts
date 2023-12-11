import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs";

export default class NevarCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "voicelb",
			description: "Show how much voice time blabla",
			localizedDescriptions: {
				de: "Zeige die aktivsten Sprecher des Tages"
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
		await this.geilerBot();
	}

	private async geilerBot(): Promise<any> {
		const voiceFile: any = JSON.parse(fs.readFileSync("./assets/voice.json"));
		if (!voiceFile.userTime) {
			const embed: EmbedBuilder = this.client.createEmbed(
				"Es war noch keiner im Voice",
				"error",
				"normal"
			);
			return this.interaction.followUp({ embeds: [embed] });
		}
		var resultArray = Object.entries(voiceFile.userTime)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		console.log(resultArray);
		const IchBinAbsolutDumm: number = voiceFile?.userTime.length || 0;
		const mostActiveUser = Object.keys(voiceFile.userTime).reduce((a, b) =>
			voiceFile.userTime[a] > voiceFile.userTime[b] ? a : b
		);
		const mostActiveUserMessages = voiceFile.userTime[mostActiveUser];
		const nevarEmbed: EmbedBuilder = this.client.createEmbed(
			"Die aktivsten Leute heute \n {0}",
			"text",
			"normal",
			resultArray
				.map(
					([id, count]) =>
						this.client.emotes.arrow + ` **<@${id}> | ${Math.round(count)}** Minuten`
				)
				.join("\n")
		);
		return this.interaction.followUp({ embeds: [nevarEmbed] });
	}
}
