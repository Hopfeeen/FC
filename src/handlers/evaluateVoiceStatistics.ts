import BaseClient from "@structures/BaseClient";
import * as fs from "fs";

async function evaluateVoiceTimeStatistics(client: BaseClient): Promise<void> {
    const voiceTimeStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/voice_statistics.json").toString());

    const guild: any = client.guilds.cache.get(client.config.support["ID"]);

    for(const userId in voiceTimeStatisticsFile.userVoiceTime) {
        const member: any = guild.members.cache.get(userId);
        if(!member) continue;

        const userVoiceTime: number = voiceTimeStatisticsFile.userVoiceTime[userId];
        const rolesToAdd: any[] = [
            { time: 60 * 1 * 10, roleId: "1180193937546289192" },
            { time: 60 * 2 * 10, roleId: "1180194548366970941" },
            { time: 60 * 4 * 10, roleId: "1180194581187395667" },
            { time: 60 * 8 * 10, roleId: "1180194611847762020" },
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