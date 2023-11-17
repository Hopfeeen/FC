import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "nevar",
            description: "Show the original bot to invite",
            localizedDescriptions: {
                de: "Zeige den originalen Bot zum einladen"
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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("Unser Bot ist auf der Basis vom Nevar Bot aufgebaut."+
        "Diesen Bot kannst du kostenlos auf deinem Discord Server einladen. Hier kommst du auf die Website https://nevar.eu", "arrow", "normal");
        return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}