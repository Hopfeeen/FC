import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class OlesenCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "olesen",
			description: "Is this the real? OLESEN",
			localizedDescriptions: {
				de: "Ist das der echte? Der echte Olesen?"
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
		await this.olesen();
	}

	private async olesen(): Promise<any> {
		const olesenEmbed: EmbedBuilder = this.client.createEmbed(
			"### Ist das der echte? JA Es ist...",
			null,
			"normal"
		);
		olesenEmbed.setImage(
			"https://cdn.discordapp.com/attachments/1116797977432961197/1175852167047958628/OLESEEEN.png?ex=656cbcaa&is=655a47aa&hm=3e6b05f68da7d9cac63bda4b41015bc05f37bc8f84096a319933bd1ed67ec237"
		);
		return this.interaction.followUp({ embeds: [olesenEmbed] });
	}
}
