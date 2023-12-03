import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class SexyCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "sexy",
            description: "You want to see a sexy Person?",
            localizedDescriptions: {
                de: "Sehe eine Sexy Person"
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
        await this.sexy();
    }

    private async sexy(): Promise<any> {
        const sexyEmbed: EmbedBuilder = this.client.createEmbed("### Sexy Person is here...", null, "normal");
        sexyEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1176558345918881873/SexyHector.png?ex=656f4e59&is=655cd959&hm=b4c2db1d2a187c67b8659bbf364c2c00412c41a5cc2b46e424a0b332d8ab1b45");
        return this.interaction.followUp({ embeds: [sexyEmbed] });
    }
}
