import BaseClient from "@structures/BaseClient";
import axios from "axios";
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventManager,
    GuildScheduledEventPrivacyLevel
} from "discord.js";

async function createBundesligaGameEvent(client: BaseClient): Promise<void> {
    const game: any = await axios.get("https://api.openligadb.de/getnextmatchbyleagueteam/4608/65", {
        validateStatus: (status: number): boolean => true,
    });

    const gameData: any = game.data;

    const guild: any = client.guilds.cache.get(client.config.support["ID"]);
    const scheduledEventManager: GuildScheduledEventManager = new GuildScheduledEventManager(guild);

    const gameStartDate: Date = new Date(gameData.matchDateTimeUTC);
    const gameEndDate: Date = new Date(gameData.matchDateTimeUTC);
    gameEndDate.setMinutes(gameEndDate.getMinutes() + 120);

    const gameLocation: string = gameData.location ? gameData.location?.locationStadium + " - " + gameData.location?.locationCity : "Unbekannt";

    const scheduledEventName: string = "⚽ | " + gameData.team1.teamName + " vs. " + gameData.team2.teamName;

    const guildScheduledEvents: any = await scheduledEventManager.fetch().catch((): void => {});

    if(guildScheduledEvents?.find((guildScheduledEvent: any): boolean => guildScheduledEvent.name === scheduledEventName)) return;

    await scheduledEventManager.create({
        name: scheduledEventName,
        scheduledStartTime: gameStartDate,
        scheduledEndTime: gameEndDate,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: {
            location: gameLocation
        },
        description: "In diesem Event siehst du das nächste Spiel unseres Effzehs! Sei gerne dabei und schreib mit uns während des Events. Klicke auf interessiert, um den Spieltag nicht zu verpassen!",
        reason: "FC Spiel",
        image: "https://cdn.discordapp.com/attachments/1116797977432961197/1176221178550026270/jubel-gladbach.png?ex=656e1456&is=655b9f56&hm=70637599c34cb23defd8aafc093f337a9177bb26558aa9060a95bf335528d138"
    }).catch((): void => {});
}

export default createBundesligaGameEvent;