import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";

export default class PlayCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "bass",
            description: "Sets the bassboost",
            localizedDescriptions: {
                de: "Setzt den Bassboost"
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
        await this.bass();
    }

    private async bass(): Promise<any> {
        const player = useMainPlayer();

        const queue: any = player.nodes.get(this.interaction.guild!.id);

        if(!queue || !queue.isPlaying()){
            const embed: EmbedBuilder = this.client.createEmbed("Es wird gerade nichts abgespielt", "error", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }

        if(queue.node.volume === 20000){
            queue.node.setVolume(100);
            const embed: EmbedBuilder = this.client.createEmbed("Bass deaktiviert", "success", "normal");
            return this.interaction.followUp({ embeds: [embed] })
        }
        queue.node.setVolume(20000);

        const embed: EmbedBuilder = this.client.createEmbed("Bassboost aktiviert (achtung laut)", "success", "normal");
        return this.interaction.followUp({ embeds: [embed] })
    }
}
