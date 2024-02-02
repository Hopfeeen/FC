import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";

export default class PlayCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "skip",
            description: "Skips the current song",
            localizedDescriptions: {
                de: "Skippt den aktuellen Song"
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
        await this.skip();
    }

    private async skip(): Promise<any> {
        const player = useMainPlayer();

        const queue: any = player.nodes.get(this.interaction.guild!.id);

        if(!queue || !queue.isPlaying()){
            const embed: EmbedBuilder = this.client.createEmbed("Es wird gerade nichts abgespielt", "error", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }

        queue.node.skip();

        const embed: EmbedBuilder = this.client.createEmbed("Lied übersprungen", "success", "normal");
        return this.interaction.followUp({ embeds: [embed] })
    }
}
