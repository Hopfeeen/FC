import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs";

export default class VoicelbCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "voicelb",
			description: "Shows the voice time leaderboard",
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
		await this.showVoiceTime();
	}

	private async showVoiceTime(): Promise<any> {
		const voiceFile: any = JSON.parse(fs.readFileSync("./assets/voice_statistics.json").toString());
		if (!voiceFile.userTime) {
			const embed: EmbedBuilder = this.client.createEmbed(
				"Es war heute noch kein Nutzer in einem Sprachkanal",
				"error",
				"normal"
			);
			return this.interaction.followUp({ embeds: [embed] });
		}
		const topVoiceUsers: any[] = Object.entries(voiceFile.userVoiceTime)
			.sort((a: any, b: any) => b[1] - a[1])
			.slice(0, 10);


		const voicetimeEmbed: EmbedBuilder = this.client.createEmbed(
			"Die aktivsten Leute heute \n {0}",
			"text",
			"normal",
			topVoiceUsers
				.map(
					([id, count]: any): string =>
						this.client.emotes.arrow + ` **<@${id}> | ${Math.round(count)}** Minuten`
				)
				.join("\n")
		);
		return this.interaction.followUp({ embeds: [voicetimeEmbed] });
	}
}