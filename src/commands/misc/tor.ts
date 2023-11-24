import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "tor",
            description: "TOOOOOOR",
            localizedDescriptions: {
                de: "TOOOOOOR"
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
        await this.handle();
    }

    private async handle(): Promise<void> {
      const randomInt: integer = Math.floor(Math.random() * 3) + 1;
      if(randomInt === 1){
        const embed = this.client.createEmbed("# TOOOOOOR FÜR UNSEREN ERSTEN EFFZEH KÖLN", null, "normal")
        embed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177713202780455013/image.png?ex=657381e4&is=65610ce4&hm=2f420e4729d8ef3f548f995d2361d07b1425ff1b73119fc93ef755879bca0298&")
        await this.interaction.followUp({ embeds:[embed] });
      }else if(randomInt === 2){
        const embed = this.client.createEmbed("# TOOOOOOR FÜR UNSEREN ERSTEN EFFZEH KÖLN", null, "normal")
        embed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177741549942091897/Bild_2023-11-24_234041758.png?ex=65739c4a&is=6561274a&hm=43048275958531a2024d7a74b9a06113aa031bb6392dafe4d5556788d89f0947&")
        await this.interaction.followUp({ embeds:[embed] });
      }else if(randomInt === 3){
        const embed = this.client.createEmbed("# TOOOOOOR FÜR UNSEREN ERSTEN EFFZEH KÖLN", null, "normal")
        embed.setImage("https://cdn.discordapp.com/attachments/1112805476011348048/1165715823332180088/tor.png?ex=656cc676&is=655a5176&hm=9047e945c5460f5a0f3d11f1e3b19978783b78b4121afbf195350005f43cc32a&")
        await this.interaction.followUp({ embeds:[embed] });
      }
    }
}