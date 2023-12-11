import BaseClient from "@structures/BaseClient";
import { createCanvas, loadImage } from "canvas"
import * as fs from "fs";
import { registerFont } from "canvas"
registerFont("./assets/SegoeUI.ttf", { family: "Segoe UI" });


async function changeBanner(client:BaseClient):Promise<void>{
    /* get guild */
    const guild: any = client.guilds.cache.get(client.config.support["ID"]);
    const image: any = await loadImage("./assets/aktivsteuserbanner.png");
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
    fs.writeFileSync("./assets/currentBanner.png", buffer);
    guild.setBanner(buffer).catch((e) => {console.log(e)});
}
export default{
    init(client:BaseClient):void{
        setInterval(():void=>{
            changeBanner(client)
        },3*60*1000)
    }
}
