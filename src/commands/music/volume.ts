import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";

export default class VolumeCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "volume",
            description: "Changes the volume",
            localizedDescriptions: {
                de: "Ändert die Lautstärke"
            },
            cooldown: 1000,
            dirname: __dirname,
            slashCommand: {
                addCommand: true,
                data: new SlashCommandBuilder()
                    .addIntegerOption((option: any) => option
                        .setName("volume")
                        .setNameLocalizations({
                            de: "lautstärke"
                        })
                        .setDescription("Die neue Lautstärke")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(9999)
                    )
            }
        });
    }

    public async dispatch(interaction: any, data: any): Promise<void> {
        this.interaction = interaction;
        this.guild = interaction.guild;
        await this.changeVolume(interaction.options.getInteger("volume"));
    }

    private async changeVolume(volume: number): Promise<any> {
        const player = useMainPlayer();

        const queue: any = player.nodes.get(this.interaction.guild!.id);

        if(!queue || !queue.isPlaying()){
            const embed: EmbedBuilder = this.client.createEmbed("Es wird gerade nichts abgespielt", "error", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }

        queue.node.setVolume(volume);


        const embed: EmbedBuilder = this.client.createEmbed("Lautstärke auf " + volume + " gesetzt", "success", "normal");
        return this.interaction.followUp({ embeds: [embed] })
    }
}
