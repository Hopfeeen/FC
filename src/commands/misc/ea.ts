import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class EaCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "ea",
            description: "We hate EA",
            localizedDescriptions: {
                de: "Wir hassen EA"
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
        await this.ea();
    }

    private async ea(): Promise<any> {
        const eaEmbed: EmbedBuilder = this.client.createEmbed("### Ea....", null, "normal");
        eaEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177681229068390460/image.png?ex=6573641d&is=6560ef1d&hm=da2b37ffd4b0f62291a8c72d788d10d15c858ceeae435d60a6497dec0bbaa8a8");
        return this.interaction.followUp({ embeds: [eaEmbed] });
    }
}
