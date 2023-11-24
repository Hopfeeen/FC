import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "kuss",
            description: "give a kiss",
            localizedDescriptions: {
                de: "gib einen kuss"
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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("### Kussi", null, "normal");
nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177711542960148510/image.png?ex=65738058&is=65610b58&hm=66aeaf3089720e712fa5b175975cf4daca6ed8f529ad769a14f55e41988ec072&");
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}