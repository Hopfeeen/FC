import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default class TabelleCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "tabelle",
            description: "Shows the table of the Bundesliga",
            localizedDescriptions: {
                de: "Zeigt die Tabelle der Bundesliga an"
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
        await this.showTable();
    }

    private async showTable(): Promise<void> {
        const table: any = await axios.get("https://api.openligadb.de/getbltable/bl1/2023");
        const tableData: any = table.data;

        let tableString: string = "";
        let i: number = 0;
        for(let tablePlace of tableData){
            i++;
            if(tablePlace.shortName === "Leverkusen"){
                tableString += this.client.emotes.arrow + " " + i + ". Bayer Pillenkusen - " + tablePlace.points + " Punkte" + "\n";
            }else if(tablePlace.shortName === "Köln") {
                tableString += " **" + this.client.emotes.arrow + " " + i + ". " + tablePlace.teamName + " - " + tablePlace.points + " Punkte**" + "\n";
            }else if(tablePlace.shortName === "Gladbach") {
                tableString += this.client.emotes.arrow + " " + i + ". Kackbach - " + tablePlace.points + " Punkte" + "\n";
            }else if(tablePlace.shortName === "Leipzig") {
                tableString += this.client.emotes.arrow + " " + i + ". Dosen - " + tablePlace.points + " Punkte" + "\n";
            }else{
                tableString += this.client.emotes.arrow + " " + i + ". " + tablePlace.teamName + " - " + tablePlace.points + " Punkte" + "\n";
            }
            tableString += "Spiele: " + tablePlace.matches + " (" + tablePlace.won + "S, " + tablePlace.draw + "U, " + tablePlace.lost + "N)" + "\n";
            tableString += "Tordifferenz: " + tablePlace.goalDiff + " (" + tablePlace.goals + ":" + tablePlace.opponentGoals + ")" + "\n\n";
        }

        const embed: EmbedBuilder = this.client.createEmbed(tableString, null, "normal");
        return this.interaction.followUp({ embeds: [embed] })
    }
}
