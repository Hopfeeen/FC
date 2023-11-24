import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from "fs"

export default class NevarCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "messageslb",
            description: "Show how much messages had been send",
            localizedDescriptions: {
                de: "Zeige wie viele Nachrichten gesendet wurden"
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
        await this.geilerBot();
    }


    private async geilerBot(): Promise<any> {
        const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
        var resultArray = Object.entries(messagesFile.users).sort((a,b)=>b[1]-a[1]).slice(0,10)
        console.log(resultArray)
        const count: number = messagesFile?.count || 0;
        const writers: number = messagesFile?.writer.length || 0;
        const mostActiveUser = Object.keys(messagesFile.users).reduce((a, b) => messagesFile.users[a] > messagesFile.users[b] ? a : b);
		const mostActiveUserMessages = messagesFile.users[mostActiveUser];
        const nevarEmbed: EmbedBuilder = this.client.createEmbed("Die aktivsten Leute heute \n {0}", "text", "normal", resultArray.map(([id,count])=> this.client.emotes.arrow + ` <@${id}> | ${count}`).join("\n"));
return this.interaction.followUp({ embeds: [nevarEmbed] });
    }
}