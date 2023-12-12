import BaseClient from "@structures/BaseClient";
import * as fs from "fs";
import {AttachmentBuilder, EmbedBuilder} from "discord.js";

async function evaluateMessageStatistics(client: BaseClient): Promise<void> {
    const messagesStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/message_statistics.json").toString());

    const messagesCount: number = messagesStatisticsFile.count || 0;
    const writersCount: any = Object.keys(messagesStatisticsFile.userMessages || {}).length;
    const mostActiveUser: any = Object.keys(messagesStatisticsFile.userMessages || {}).reduce(
        (a, b) => (messagesStatisticsFile.userMessages[a] > messagesStatisticsFile.userMessages[b] ? a : b)
    );

    const guild: any = client.guilds.cache.get(client.config.support["ID"]);
    const pokalSiegerRole: any = guild.roles.cache.get("1176251297138225214");

    const addRole = (userId: string, threshold: number, roleId: string) => {
        const member: any = guild.members.cache.get(userId);
        if(member && messagesStatisticsFile.userMessages[userId] >= threshold){
            member.roles.add(roleId).catch((): void => {});
        }
    }

    for(const userId in messagesStatisticsFile.userMessages || {}){
        addRole(userId, 100, "1179181120596738139");
        addRole(userId, 250, "1179181792587153549");
        addRole(userId, 500, "1179181862543958047");
        addRole(userId, 1000, "1179181918537912404");
    }

    pokalSiegerRole?.members.forEach((member: any, i: number): void => {
        setTimeout((): void => {
            member.roles.remove(pokalSiegerRole).catch((): void => {});
        }, i * 1000);
    });

    await client.wait(5000);

    const messageStatisticsEmbed: EmbedBuilder = client.createEmbed(getEmbedMessage(messagesCount, writersCount, mostActiveUser), null, "normal");
    const topThreeBannerAttachment: AttachmentBuilder = new AttachmentBuilder("./assets/banner_message_stats.png");
    messageStatisticsEmbed.setImage("attachment://banner_message_stats.png");

    const channel: any = guild.channels.cache.get("1167208720242053231");
    channel.send({ embeds: [messageStatisticsEmbed], files: [topThreeBannerAttachment] });

    fs.writeFileSync("./assets/message_statistics.json", JSON.stringify({}));


    function getEmbedMessage(count: number, writers: number, mostActiveUser: any): string {
        const thresholds: number[] = [250, 750, 1500, 3000];
        const messages: string[] = [
            "Ein depremierender Tag für unseren Server!",
            "Hey, morgen wirds besser!",
            "Klasse!",
            "Sehr stark!!!",
            "Wenn selbst Hennes stolz ist, dann wisst ihr, ihr habts geschafft!"
        ];

        for(let i = 0; i < thresholds.length; i++){
            if(count < thresholds[i] || i === thresholds.length - 1){
                return messages[i] + " Heute wurden **" + count + " Messages** von **" + writers + " Personen** geschrieben! Der aktivste User war <@&" + mostActiveUser + ">! Danke für eure Aktivität <3";
            }
        }
        return "";
    }
}

export default evaluateMessageStatistics;