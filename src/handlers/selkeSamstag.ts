import { ButtonBuilder, ComponentType, EmbedBuilder } from "discord.js";
import fs from "fs";
import BaseClient from "@structures/BaseClient"

async function selkeSamstag(client: BaseClient): Promise<void> {
	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	const channel: any = guild.channels.cache.get("813887099065073714");

	const selkeSamstagEmbed: EmbedBuilder = client.createEmbed("Es ist wieder soweit... **Es ist...**", null, "normal");
	selkeSamstagEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175857152598999192/SelkeSamstag.png?ex=656cc14f&is=655a4c4f&hm=9ae60215fa91e52d215ef7e1888034698fcbb53ebf1e23118d3ac9ee74c71967");
	const selkeSamstagButton: ButtonBuilder = client.createButton("Hallo", "SELKE SAMSTAG", "Success", "<:Selke:1189721350823215115>", false)
	const selkeButtonReihe: any = client.createMessageComponentsRow(selkeSamstagButton)

	const message = await channel.send({ embeds: [selkeSamstagEmbed], components: [selkeButtonReihe] });
	const userids:any[] = []
	const collector = message.createMessageComponentCollector({time: 1000 * 60 * 5, componentType:ComponentType.Button})
	const SelkeDatei: any = JSON.parse(fs.readFileSync("./assets/selke_samstag.json").toString());
	collector.on("collect",(i:any):void => {
		if (userids.includes(i.user.id)) return;
		SelkeDatei.userClickCount = SelkeDatei.userClickCount || {};
		SelkeDatei.userClickCount[i.user.id] = (SelkeDatei?.userClickCount[i.user.id] || 0) + 1;
		fs.writeFileSync("./assets/selke_samstag.json", JSON.stringify(SelkeDatei, null, 2))
		userids.push(i.user.id)
		i.reply({ content: i.user.toString() + " Du feierst den Selke Samstag Yayy" });

		const addRole = (userId: string, threshold: number, roleId: string) => {
			const member: any = guild.members.cache.get(userId);
			if (member && SelkeDatei.userClickCount[userId] >= threshold) {
				member.roles.add(roleId).catch((): void => {
				});
			}
		}

		for (const userId in SelkeDatei.userClickCount || {}) {
			addRole(userId, 1, "1189754631644008578");
			addRole(userId, 3, "1189754684374798386");
			addRole(userId, 5, "1189754727341248683");
			addRole(userId, 10, "1189754763613569054");
		}
	})
}
export default selkeSamstag;