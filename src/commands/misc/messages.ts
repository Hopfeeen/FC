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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("Heute wurden bisher {0} Nachrichten von {1} Schreibern gesendet", null, "normal", count, writers);
nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175852167047958628/OLESEEEN.png?ex=656cbcaa&is=655a47aa&hm=3e6b05f68da7d9cac63bda4b41015bc05f37bc8f84096a319933bd1ed67ec237&");
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}