import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs"

export default class NevarCommand extends BaseCommand {
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
        await this.geilerBot();
    }

    private async geilerBot(): Promise<any> {
        const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
        const count: number = messagesFile?.count || 0;
        const writers: number = messagesFile?.writer.length || 0;
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("Heute wurden bisher {0} Nachrichten von {1} Menschen geschrieben! Danke für eure Aktivität <3", this.client.emotes.arrow, "normal", count, writers);
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}