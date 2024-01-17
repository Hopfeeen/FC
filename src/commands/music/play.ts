import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";

export default class PlayCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "play",
            description: "Plays a song",
            localizedDescriptions: {
                de: "Spielt einen Song ab"
            },
            cooldown: 1000,
            dirname: __dirname,
            slashCommand: {
                addCommand: true,
                data: new SlashCommandBuilder()
                    .addStringOption((option: any) => option
                        .setName("song")
                        .setDescription("Der Song, der abgespielt werden soll")
                        .setRequired(true)
                    )
            }
        });
    }

    public async dispatch(interaction: any, data: any): Promise<void> {
        this.interaction = interaction;
        this.guild = interaction.guild;
        await this.play(interaction.options.getString("song"));
    }

    private async play(query: string): Promise<any> {
        const player = useMainPlayer();
        const channel = this.interaction.member!.voice.channel;
        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: this.interaction
                }
            });

            const embed: EmbedBuilder = this.client.createEmbed(track.title + " wurde zur Warteschlange hinzugefügt", "success", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }catch(e: any) {
            const embed: EmbedBuilder = this.client.createEmbed("Es ist ein Fehler aufgetreten", "error", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }
    }
}
