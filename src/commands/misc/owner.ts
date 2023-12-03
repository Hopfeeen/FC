import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "owner",
            description: "Owner",
            localizedDescriptions: {
                de: "Owner"
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
        await this.owner();
    }

    private async owner(): Promise<any> {
        const ownerEmbed: EmbedBuilder = this.client.createEmbed("### Der Owner auf dem Server ist Hopfen", null, "normal")
        return this.interaction.followUp({ embeds: [ownerEmbed] });
    }
}
