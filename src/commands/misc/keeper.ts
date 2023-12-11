import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class KeeperCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "keeper",
			description: "This is our Keeper",
			localizedDescriptions: {
				de: "Unser Stammkeeper."
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
		await this.keeper();
	}

	private async keeper(): Promise<any> {
		const keeperEmbed: EmbedBuilder = this.client.createEmbed(
			"### Hier ist UNSERE NUMMER 44. MATHIAAAAAAS KÖBBBBIIINNNGGGGGGGG!!!!!",
			null,
			"normal"
		);
		keeperEmbed.setImage(
			"https://cdn.discordapp.com/attachments/1116797977432961197/1177675326147539035/Bild_2023-11-24_191709869.png?ex=65735e9d&is=6560e99d&hm=a44f997404ef4af11faa72e25f3a974506499195e2a5b60d60498062987b3d53"
		);
		return this.interaction.followUp({ embeds: [keeperEmbed] });
	}
}
