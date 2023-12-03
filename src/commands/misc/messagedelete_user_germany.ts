import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "messagesdelete_user_germany",
            description: "Deletes user messages",
            localizedDescriptions: {
                de: "Löscht Nutzernachrichten"
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
        await this.delete();
    }

    private async delete(): Promise<any> {
        const deleteEmbed: EmbedBuilder = this.client.createEmbed("### Erfolgreich! Die Nachrichten von <@844621823089967144> wurden zurückgesetzt", null, "normal");
        return this.interaction.followUp({ embeds: [deleteEmbed] });
    }
}
