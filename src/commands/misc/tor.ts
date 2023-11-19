import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "tor",
            description: "Use the Command when Cologne score a Goal",
            localizedDescriptions: {
                de: "Benutze den Command wenn Köln ein tor schießt"
            },
            cooldown: 100,
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
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("### TOOOOOR FÜR UNSEREN ERSTEN EFFZEH KÖLN!!!!", null, "normal");
nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1112805476011348048/1165715823332180088/tor.png?ex=65638bf6&is=655116f6&hm=7a8d7b70feb3efc1024edcdfef843f50e9295405b003d9623ee9ab5f2e3be6f8&");
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}