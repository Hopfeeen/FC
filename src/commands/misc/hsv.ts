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
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY4qntm_uAPFZSLkukh4inw9hCp78ILDXoFtIprpnNMiOUwGAlheEXBGMyiUgzvIv_z4Y&usqp=CAU"
		);
		return this.interaction.followUp({ embeds: [hsvEmbed] });
	}
}
