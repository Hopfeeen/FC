import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class HsvCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "hsv",
			description: "For Jonas",
			localizedDescriptions: {
				de: "Für Jonas"
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
		await this.hsv();
	}

	private async hsv(): Promise<any> {
		const hsvEmbed: EmbedBuilder = this.client.createEmbed(
			"### Ist das der echte? JA Es ist...",
			null,
			"normal"
		);
		hsvEmbed.setImage(
			"https://cdn.discordapp.com/attachments/1118163602310959134/1176285787453653032/csm_2_bl_logo_RGB_pos_076ac1ea68.png?ex=656e5082&is=655bdb82&hm=25fe3982d3c5c6789b2937d386660a38589842b0f2e1b312331533909dda6919"
		);
		return this.interaction.followUp({ embeds: [hsvEmbed] });
	}
}
