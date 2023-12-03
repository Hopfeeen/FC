import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs"

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
        const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
        const count: number = messagesFile?.count || 0;
        const writers: number = messagesFile?.writer.length || 0;
        const mostActiveUser = Object.keys(messagesFile.users).reduce((a, b) => messagesFile.users[a] > messagesFile.users[b] ? a : b);
	const mostActiveUserMessages = messagesFile.users[mostActiveUser];
        const messagesEmbed: EmbedBuilder = this.client.createEmbed("Heute wurden bisher **{0} Nachrichten** von **{1} Menschen** geschrieben! Bisher ist <@{2}> der Aktivste! Danke für eure Aktivität <3", "arrow", "normal", count, writers, mostActiveUser);
	return this.interaction.followUp({ embeds: [messagesEmbed] });
    }
}
