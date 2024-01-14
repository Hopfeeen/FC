import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class karneval extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "karneval",
			description: "When its Carneval?",
			localizedDescriptions: {
				de: "Wann ist Karneval??"
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
		await this.karneval();
	}

	private async karneval(): Promise<any> {
		const adamyanEmbed: EmbedBuilder = this.client.createEmbed(
			"**Viva Colonia** und **Leev Marie** durch alle Straßen in **Köln** hören! \n Dieses Jahr ist **Weiberfastnacht** am **8.2** \n " +
			"Der **Aschermittwoch** wo bekanntlich alles **vorbei** ist, ist dann 6 Tage später am **14.02**. \n \n **Rosenmontag** ist natürlich 2 Tage vorher am **12.02.2024** um **11:11**. \n Das ist **__<t:1707732660:R>__**",
			null,
			"normal"
		);
		adamyanEmbed.setImage(
			"https://cdn.discordapp.com/attachments/1078810235336130630/1196187904595210360/fckarneval.png?ex=65b6b7cc&is=65a442cc&hm=3019f3a60c75c2a11f52c960ae63d807ad75e90daf102a835837c2f2ab6d72d3&"
		);
		return this.interaction.followUp({ embeds: [adamyanEmbed] });
	}
}
