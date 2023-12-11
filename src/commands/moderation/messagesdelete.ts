import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs";

export default class AvatarCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "messagesdelete",
			description: "Delete messages from User",
			localizedDescriptions: {
				de: "Lösche Messages von Usern"
			},
			memberPermissions: ["KickMembers"],
			cooldown: 1000,
			dirname: __dirname,
			slashCommand: {
				addCommand: true,
				data: new SlashCommandBuilder()
					.addUserOption((option) =>
						option
							.setName("member")
							.setNameLocalizations({
								de: "mitglied"
							})
							.setDescription("Choose a member")
							.setDescriptionLocalizations({
								de: "Wähle ein Mitglied"
							})
							.setRequired(true)
					)
					.addIntegerOption((option) =>
						option
							.setName("anzahl")
							.setNameLocalizations({
								de: "anzahl"
							})
							.setDescription("Wähle die Anzahl die Gelöscht werden sollen")
							.setDescriptionLocalizations({
								de: "Wähle die Anzahl die Gelöscht werden sollen"
							})
							.setRequired(true)
					)
			}
		});
	}
	public async dispatch(interaction: any, data: any): Promise<void> {
		this.interaction = interaction;
		this.guild = interaction.guild;
		await this.messagesDelete(
			interaction.options.getUser("member"),
			interaction.options.getInteger("anzahl")
		);
	}

	private async messagesDelete(user: any, anzahl: number): Promise<any> {
		const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
		if (messagesFile.users[user.id])
			messagesFile.users[user.id] = messagesFile.users[user.id] - anzahl;
		fs.writeFileSync("./assets/messages.json", JSON.stringify(messagesFile, null, 4));
		const embed: EmbedBuilder = this.client.createEmbed(
			"{0} wurden {1} Nachrichten abgezogen.",
			"success",
			"normal",
			user.toString(),
			anzahl
		);
		return this.interaction.followUp({ embeds: [embed] });
	}
}
