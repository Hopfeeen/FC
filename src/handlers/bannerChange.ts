import BaseClient from "@structures/BaseClient";
import { createCanvas, loadImage } from "canvas"
import * as fs from "fs";
import { registerFont } from "canvas"
registerFont("./assets/SegoeUI.ttf", { family: "Segoe UI" });


async function setMessagesStatsBanner(client: BaseClient): Promise<void> {
    /* get guild */
    const guild: any = client.guilds.cache.get(client.config.support["ID"]);
    const image: any = await loadImage("./assets/banner_message_stats_template.png");
    const canvas: any = createCanvas(image.width, image.height);
    const ctx: any = canvas.getContext("2d");
    const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
    if(!messagesFile.users) return
    const resultArray = Object.entries(messagesFile.users).sort((a, b) => b[1] - a[1]).slice(0, 3);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.font = "45px SegoeUI";
    ctx.fillStyle = "black";
    let i = 0;
    let yCoord = 226;
    for(let user of resultArray){
        i++;
        const user1 = await client.users.fetch(user[0]).catch(() => {});
        ctx.fillText(user1?.displayName, 75, yCoord);
        let countxCoord = 450;
        const userLength = user[1].toString().length;

        for (let i = 1; i < userLength; i++) {
            countxCoord -= 30;
        }

        ctx.fillText(user[1], countxCoord, yCoord);
        if(i === 1) yCoord = yCoord + 90;
        if(i === 2) yCoord = yCoord + 85;
    }

    const buffer: any = canvas.toBuffer("image/png");
    fs.writeFileSync("./assets/banner_message_stats.png", buffer);

    guild.setBanner(buffer).catch((e) => {console.log(e)});
}

async function setBoosterBanner(client: BaseClient): Promise<void> {
    /* get guild */
    const guild: any = client.guilds.cache.get(client.config.support["ID"]);
    const image: any = await loadImage("./assets/banner_booster_template.png");
    const canvas: any = createCanvas(image.width, image.height);
    const ctx: any = canvas.getContext("2d");

    const boostCount: any = guild.premiumSubscriptionCount;

    let boosters: any[] = [];
    guild.members.fetch().then((fetchedMembers: any): void => {
        boosters = fetchedMembers.filter((member: any): boolean => member.premiumSince !== null);
    });

    const randomBooster = boosters[Math.floor(Math.random()*boosters.length)];

    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.font = "45px SegoeUI";
    ctx.fillStyle = "black";

    ctx.fillText(randomBooster?.displayName || "Unbekannt", 70, 205);


    ctx.font = "80px SegoeUI";
    ctx.fillText(boostCount || 0, 140, 370);

    ctx.fillText(String(boosters.length || 0), 460, 370);

    const buffer: any = canvas.toBuffer("image/png");
    fs.writeFileSync("./assets/banner_booster.png", buffer);

    guild.setBanner(buffer).catch((e) => {console.log(e)});
}



export default{
    init(client:BaseClient):void{
        setInterval(():void=>{
            const randomInt = client.utils.getRandomInt(1, 1);
            if(randomInt === 1) setMessagesStatsBanner(client);
            if(randomInt === 2) setBoosterBanner(client);
        },3*60*1000)
    }
}
