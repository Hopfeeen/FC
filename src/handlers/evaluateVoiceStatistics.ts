import BaseClient from "@structures/BaseClient";
import * as fs from "fs";

async function evaluateVoiceTimeStatistics(client: BaseClient): Promise<void> {
    const voiceTimeStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/voice_statistics.json").toString());

    for(const userId in voiceTimeStatisticsFile.userVoiceTime){
        if(voiceTimeStatisticsFile.userJoinTime[userId]){
            const joinDate: any = voiceTimeStatisticsFile.userJoinTime[userId];
            const userVoiceTime: any = Date.now() - joinDate;
            const minutes: any = userVoiceTime / 60 * 1000;

            voiceTimeStatisticsFile.userVoiceTime[userId] = (voiceTimeStatisticsFile.userVoiceTime[userId] || 0) + minutes;

            voiceTimeStatisticsFile.userJoinTime = voiceTimeStatisticsFile.userJoinTime || {};
            voiceTimeStatisticsFile.userJoinTime[userId] = Date.now();
        }
    }
    fs.writeFileSync("./assets/voice_statistics.json", JSON.stringify(voiceTimeStatisticsFile, null, 2));

    const guild: any = client.guilds.cache.get(client.config.support["ID"]);

    for(const userId in voiceTimeStatisticsFile.userVoiceTime) {
        const member: any = guild.members.cache.get(userId);
        if(!member) continue;

        const userVoiceTime: number = voiceTimeStatisticsFile.userVoiceTime[userId];

        const mostActiveUser: any = Object.keys(voiceTimeStatisticsFile.userVoiceTime || {}).reduce(
            (a, b) => (voiceTimeStatisticsFile.userVoiceTime[a] > voiceTimeStatisticsFile.userVoiceTime[b] ? a : b)
        );

        const pokalSiegerRole: any = guild.roles.cache.get("1176251297138225214");
        pokalSiegerRole?.members.forEach((member: any, i: number): void => {
            setTimeout((): void => {
                member.roles.remove(pokalSiegerRole).catch((): void => {});
            }, i * 1000);
        });

        guild.members.cache.get(mostActiveUser).roles.add(pokalSiegerRole).catch((): void => {});

        const rolesToAdd: any[] = [
            { time: 60 * 1, roleId: "1180193937546289192" },
            { time: 60 * 4, roleId: "1180194548366970941" },
            { time: 60 * 8, roleId: "1180194581187395667" },
            { time: 60 * 12, roleId: "1180194611847762020" },
        ];

        rolesToAdd.forEach((roleToAdd: any) => {
            if(userVoiceTime >= roleToAdd.time){
                member.roles.add(roleToAdd.roleId);
            }
        })
    }

    voiceTimeStatisticsFile.userVoiceTime = {};
    fs.writeFileSync("./assets/voice_statistics.json", JSON.stringify(voiceTimeStatisticsFile, null, 2));
}

export default evaluateVoiceTimeStatistics;