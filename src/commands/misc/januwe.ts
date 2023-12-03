import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class JanuweCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "januwe",
            description: "The drip",
            localizedDescriptions: {
                de: "Der drip ist da"
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
        await this.janUwe();
    }

    private async janUwe(): Promise<any> {
        const januweEmbed: EmbedBuilder = this.client.createEmbed("### Der drip ist da, das weiß jeder!", null, "normal");
        januweEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1180247664332374056/JANNNNUWEEE.png?ex=657cba4b&is=656a454b&hm=cc72915b5801dd678e245de9ff5adb1e90ff4ce4eb5dda0c162e427c156c0a10");
        return this.interaction.followUp({ embeds: [januweEmbed] });
    }
}
