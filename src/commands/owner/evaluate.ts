import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder } from "discord.js";

export default class EvaluateCommand extends BaseCommand {
    public constructor(client: BaseClient) {
        super(client, {
            name: "evaluate",
            description: "Führt gegebenen Code aus",
            ownerOnly: true,
            dirname: __dirname,
            slashCommand: {
                addCommand: false,
                data: null
            }
        });
    }


    public async dispatch(message: any, args: any[], data: any): Promise<void> {
        this.message = message;
        await this.evaluate(args.join(" "));
    }

    private async evaluate(code: string): Promise<void> {
        try {
            eval(code)
        }catch(e){
            const errorEmbed: EmbedBuilder = this.client.createEmbed(
                `Error: ${e}`,
                "error",
                "error"
            );
            return this.message.reply({ embeds: [errorEmbed] });
        }
    }
}
