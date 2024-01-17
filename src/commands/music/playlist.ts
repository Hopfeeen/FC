import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";

export default class PlaylistCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "playlist",
            description: "Shows the current playlist",
            localizedDescriptions: {
                de: "Zeigt die aktuelle Wiedergabeliste an"
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
        await this.stop();
    }

    private async stop(): Promise<any> {
        const player = useMainPlayer();

        const queue: any = player.nodes.get(this.interaction.guild!.id);

        if(!queue){
            const embed: EmbedBuilder = this.client.createEmbed("Es sind derzeit keine Lieder in der Warteschlange", "error", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }

        const tracks = queue.tracks.map((track: any, index: any) => ++index + ". [" + track.title + "](" + track.url + ")" )

        await this.client.utils.sendPaginatedEmbed(this.interaction, 10, tracks, "Wiedergabeliste", "Derzeit sind keine Lieder in der Warteschlange", "arrow");
    }
}
