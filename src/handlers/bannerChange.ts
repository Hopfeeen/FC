import BaseClient from "@structures/BaseClient";
import { createCanvas, loadImage, registerFont } from "canvas";
import * as fs from "fs";

async function setMessagesStatsBanner(client: BaseClient): Promise<void> {
	registerFont("./assets/SegoeUI.ttf", { family: "Segoe UI" });

	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	const image: any = await loadImage("./assets/banner_message_stats_template.png");
	const canvas: any = createCanvas(image.width, image.height);
	const ctx: any = canvas.getContext("2d");

	const messagesFile: any = JSON.parse(fs.readFileSync("./assets/message_statistics.json").toString());
	if (!messagesFile.userMessages) return;

	const resultArray: any[] = Object.entries(messagesFile.userMessages)
		.sort((a: any, b: any) => b[1] - a[1])
		.slice(0, 3);

	ctx.drawImage(image, 0, 0, image.width, image.height);
	ctx.font = '45px "Segoe UI"';
	ctx.fillStyle = "black";

	let yCoord: number = 226;
	for (let [userId, messageCount] of resultArray) {
		const user: any = await client.users.fetch(userId).catch(() => {});
		if (!user) continue;

		ctx.fillText(user.displayName, 75, yCoord);

		let countxCoord: number = 450 - 30 * (Math.max(messageCount.toString().length - 1, 0));
		ctx.fillText(messageCount, countxCoord, yCoord);

		yCoord += (resultArray.length === 1 ? 90 : 85);
	}

	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./assets/banner_message_stats.png", buffer);

	guild.setBanner(buffer).catch((e: any): void => {
		console.log(e);
	});
}

async function setBoosterBanner(client: BaseClient): Promise<void> {
	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	const image: any = await loadImage("./assets/banner_booster_template.png");
	const canvas: any = createCanvas(image.width, image.height);
	const ctx: any = canvas.getContext("2d");

	const boostCount: number|null = guild.premiumSubscriptionCount;
	const fetchedMembers: any = await guild.members.fetch();
	let boosters: any[] = [];
	for(let member of[...fetchedMembers]){
		if(member[1].premiumSinceTimestamp !== null) boosters.push(member[1]);
	}

	const randomBooster: any = boosters[Math.floor(Math.random() * boosters.length)];

	ctx.drawImage(image, 0, 0, image.width, image.height);
	ctx.font = "45px SegoeUI";
	ctx.fillStyle = "black";

	ctx.fillText(randomBooster?.displayName || "Unbekannt", 50, 225);
	ctx.font = "100px SegoeUI";
	ctx.fillText(boostCount || 0, 110, 420);
	ctx.fillText(String(boosters.length || 0), 320, 420);

	const buffer: any = canvas.toBuffer("image/png");
	fs.writeFileSync("./assets/banner_booster.png", buffer);

	guild.setBanner(buffer).catch((e: any): void => {
		console.log(e);
	});
}

export default {
	init(client: BaseClient): void {
		setInterval(
			(): void => {
				const randomInt = client.utils.getRandomInt(1, 2);
				if (randomInt === 1) setMessagesStatsBanner(client);
				if(randomInt === 2) setBoosterBanner(client);
			},
			5 * 60 * 1000
		);
	}
};
