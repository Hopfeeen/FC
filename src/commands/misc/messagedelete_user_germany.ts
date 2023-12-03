import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "messagesdelete_user_germany",
            description: "On the 8 Day",
            localizedDescriptions: {
                de: "Am 8. Tag"
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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("### Erfolgreich! Die Nachrichten von <@844621823089967144> wurden zurückgesetzt", null, "normal");
        return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}
