import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "schlaganfall",
            description: "This is dangerous stuff",
            localizedDescriptions: {
                de: "Schlaganfall."
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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("### Baumi hat 2-3 Kölsch zu viel", null, "normal");
nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177673316375470190/koelns-trainer-steffen-baumgart-geniesst-karnevals.png?ex=65735cbe&is=6560e7be&hm=de39c2de63eb67c54ef285082fc1b0c4bcfa91c5f0794c17a1c7eaf3817d23ac&");
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}