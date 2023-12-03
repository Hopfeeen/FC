import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class AdamyanCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "adamyan",
            description: "A real model?",
            localizedDescriptions: {
                de: "Ein echter Model? Hier ist er"
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
        await this.adamyan();
    }

    private async adamyan(): Promise<any> {
        const adamyanEmbed: EmbedBuilder = this.client.createEmbed("### Model??!?! MODEL!!!", null, "normal");
        adamyanEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175905401464684715/image.png?ex=656cee3e&is=655a793e&hm=aa21cd0fc3ebd1f8ff2dc08ab3947dc5121178ef8c6cc12eb3eddaff21d3681b");
        return this.interaction.followUp({ embeds: [adamyanEmbed] });
    }
}
