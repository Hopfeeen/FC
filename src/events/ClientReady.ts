import * as fs from "fs";
import { scheduleJob } from "node-schedule";
import moment from "moment";
import { Collection, ComponentType, Guild, Invite, AttachmentBuilder } from "discord.js";

import handlePresence from "@handlers/presence";
import registerInteractions from "@handlers/registerInteractions";
import TOPGG from "@helpers/Top.gg";
import changeBanner from "@handlers/bannerChange";
import unbanMembers from "@handlers/unbanMembers";
import unmuteMembers from "@handlers/unmuteMembers";
import remindMembers from "@handlers/remindMembers";
import youtubeNotifier from "@handlers/youtubeNotifier";
import twitchNotifier from "@handlers/twitchNotifier";
import endGiveaways from "@handlers/endGiveaways";
import updatePolls from "@handlers/updatePolls";
import dashboard from "@dashboard/app";
import api from "@api/app";
import BaseClient from "@structures/BaseClient";
import axios from "axios";
import { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType  } from "discord.js";
import guild from "@schemas/Guild";

export default class {
	public client: BaseClient;
	public constructor(client: any) {
		this.client = client;
	}

	public async dispatch(): Promise<any> {
		const client: any = this.client;
		const config = client.config;

		/* Initialize levels */
		await this.client.levels.setURL(config.general["MONGO_CONNECTION"]);

		/* Initialize giveaways manager */
		client.logger.log("Initializing giveaways manager...");
		client.logger.success("Initialized giveaways manager");

		/* Update interactions every day at 00:00 */
		scheduleJob("0 0 * * *", async (): Promise<void> => {
			await registerInteractions(client);
		});

		/* Initiate presence handler */
		handlePresence(client);

		/* Create Bundesliga game events */
		scheduleJob("0 0 * * *", async (): Promise<void> => {
			/* get next game */
			const game: any = await axios.get("https://api.openligadb.de/getnextmatchbyleagueteam/4608/65", {
  				validateStatus: (status: number): boolean => true
			});
			const gameData: any = game.data;

			/* get guild and initiate guild event manager */
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);
			const eventManager: GuildScheduledEventManager = new GuildScheduledEventManager(guild);

			/* get start and end date */
			const gameStartDate: any = new Date(gameData.matchDateTimeUTC);
			const gameEndDate: any = new Date(gameData.matchDateTimeUTC);
			gameEndDate.setMinutes(gameEndDate.getMinutes() + 120);

			/* get location */
			let location: string = "Unbekannt";
			if(gameData.location) location = gameData.location?.locationStadium + " - " + gameData.location?.locationCity;

			/* check if event already exists */
			const events: any = await eventManager.fetch().catch(() => {});
			if(events && events?.find(event => event.name === "⚽ | " + gameData.team1.teamName + " vs. " + gameData.team2.teamName)) return;

			/* create game event */
			await eventManager.create({
				name: "⚽ | " + gameData.team1.teamName + " vs. " + gameData.team2.teamName,
				scheduledStartTime: gameStartDate,
				scheduledEndTime: gameEndDate,
				privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
				entityType: GuildScheduledEventEntityType.External,
				description: "Das nächste Spiel von Köln wird präsentiert von [E leeve lang](https://instagram.com/e.leeve.lang) ! In diesem Event siehst du das nähste Spiel unseres Effzehs! Sei gerne dabei und schreib mit uns während des Events. Klicke auf intressiert um den Spieltag nicht zu verpassen!",
				entityMetadata: {
					location: location
				},
				reason: "FC Spiel",
				image: "https://cdn.discordapp.com/attachments/1116797977432961197/1176221178550026270/jubel-gladbach.png?ex=656e1456&is=655b9f56&hm=70637599c34cb23defd8aafc093f337a9177bb26558aa9060a95bf335528d138"
			}).catch((): void => {});
		})

		/* Evaluate voice statistics */
		scheduleJob("0 0 * * *", async (): Promise<void> => {
			/* get voice statistics */
			const voiceFile: any= JSON.parse(fs.readFileSync(("./assets/voice.json")));

			/* get guild */
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);

			/* add roles to users */
			for(let user in voiceFile.userTime){
				const member = guild.members.cache.get(user);
				if(member){
					if(voiceFile.userTime[user] > 60*1*10){
						member.roles.add("1180193937546289192")
					}
					if(voiceFile.userTime[user] > 60*2*10){
						member.roles.add("1180194548366970941")
					}
					if(voiceFile.userTime[user] > 60*4*10){
						member.roles.add("1180194581187395667")
					}
					if(voiceFile.userTime[user] > 60*8*10){
						member.roles.add("1180194611847762020")
					}
				}
			}

			/* reset file */
			voiceFile.userTime = {};
			fs.writeFileSync("./assets/voice.json", JSON.stringify(voiceFile));
		});


		/* evaluate message statistics */
		scheduleJob("0 0 * * *", async (): Promise<void> => {
			/* get message statistics */
	        	const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
	            	const count: number = messagesFile?.count || 0;
	            	const writers: number = messagesFile?.writer.length || 0;
			const mostActiveUser = Object.keys(messagesFile.users).reduce((a, b) => messagesFile.users[a] > messagesFile.users[b] ? a : b);

			/* get guild */
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);

			/* fetch most active user */
			const user: any = await guild.members.fetch(mostActiveUser).catch(() => {});
			const role: any = guild.roles.cache.get("1176251297138225214");

			/* add roles to users */
			for(let user in messagesFile.users){
				const member = guild.members.cache.get(user);
				if(!member) continue;
				if(messagesFile.users[user] > 100){
					member.roles.add("1179181120596738139")
				}else if(messagesFile.users[user] > 250){
					member.roles.add("1179181792587153549")
				}else if(messagesFile.users[user] > 500){
					member.roles.add("1179181862543958047")
				}else if(messagesFile.users[user] > 1000){
					member.roles.add("1179181918537912404")
				}
			}

			/* remove Pokalsieger role from all users */
			role.members.forEach((member: any, i: any) => {
				setTimeout(() => {
					member.roles.remove(role);
				}, i * 1000);
			});
			await this.client.wait(5000)

			/* add Pokalsieger role to most active user */
			user.roles.add(role);

			/* send message */
			const mostActiveUserMessages = messagesFile.users[mostActiveUser];
			const file = new AttachmentBuilder("../../assets/currentBanner.png");
            		let messagesEmbed;
			if (count < 250){
				messagesEmbed = this.client.createEmbed("Ein depremierender Tag für unseren Server! Heute wurden leider nur **{0} Messages** geschrieben. Dabei waren **{1} Menschen** beteiligt. Der aktivste User war <@{2}>! Danke für eure Aktivität <3", null, "normal", count, writers, mostActiveUser);
				messagesEmbed.setImage("attachment://currentBanner.png");
			}else if (count > 250 && count < 750){
				messagesEmbed = this.client.createEmbed("Hey, morgen wirds besser! Heute wurden **{0} Messages** geschrieben. Dabei haben **{1} Menschen** geschrieben. Dabei war <@{2}> der aktivste! Danke für eure Aktivität <3 ", null, "normal", count, writers, mostActiveUser);
				messagesEmbed.setImage("attachment://currentBanner.png")
			}else if (count < 1500 && count > 750){
				messagesEmbed = this.client.createEmbed("Klasse! Heute wurden **{0} Messages** von **{1} Personen** geschrieben! Der aktivste User war <@{2}>! Danke für eure Aktivität <3", null, "normal", count, writers, mostActiveUser);
				messagesEmbed.setImage("attachment://currentBanner.png")
			}else if (count < 3000 && count > 1500){
				messagesEmbed = this.client.createEmbed("Sehr Stark!!! Alleine heute wurden **{0} Messages** geschrieben. Dabei haben **{1} Leute** geholfen! Der aktivste User war <@{2}>! Vielen Dank für eure Aktivität <3", null, "normal", count, writers, mostActiveUser);
				messagesEmbed.setImage("attachment://currentBanner.png")
			}else if (count > 3000){
				messagesEmbed = this.client.createEmbed("Wenn selbst Hennes stolz ist, dann wisst ihr, ihr habts geschafft! Heute wurden **{0} Messages** von insgesamt **{1} Menschen** geschrieben! Der aktivste User war <@{2}> Vielen Dank für eure Aktivität <3", null, "normal", count, writers, mostActiveUser);
				messagesEmbed.setImage("attachment://currentBanner.png")
			}
            		const channel: any = guild.channels.cache.get("813887099065073714");
            		channel.send({embeds:[messagesEmbed]});

			/* reset messages file */
            		fs.writeFileSync("./assets/messages.json", JSON.stringify({}));
        	});

		/* Selke Samstag */
		scheduleJob("0 0 * * 6", async (): Promise<void> => {
			/* get guild */
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);
			const channel: any = guild.channels.cache.get("813887099065073714");
			const selkeSamstagEmbed: any = this.client.createEmbed("Es ist wieder soweit... **Es ist...**", null, "normal");
			selkeSamstagEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175857152598999192/SelkeSamstag.png?ex=656cc14f&is=655a4c4f&hm=9ae60215fa91e52d215ef7e1888034698fcbb53ebf1e23118d3ac9ee74c71967&");
			channel.send({ embeds: [selkeSamstagEmbed] });
		  });

		/* Initiate dashboard */
		if (config.dashboard["ENABLED"]) dashboard.init(client);

		/* Initiate handlers */
		TOPGG.init(client);
		unbanMembers.init(client);
		unmuteMembers.init(client);
		remindMembers.init(client);
		youtubeNotifier.init(client);
		twitchNotifier.init(client);
		endGiveaways.init(client);
		updatePolls.init(client);
		changeBanner.init(client);
		if (config.api["ENABLED"]) api.init(client);

		/* Support server stats channels */
		if (config.support["ID"]) {
			setInterval(() => {
				const supportGuild: Guild = client.guilds.cache.get(config.support["ID"]);
				let serverChannel: any, voteChannel: any, userChannel: any;
				if (config.channels["SERVER_COUNT_ID"])
					serverChannel = supportGuild.channels.cache.get(
						config.channels["SERVER_COUNT_ID"]
					);
				if (config.channels["VOTE_COUNT_ID"])
					voteChannel = supportGuild.channels.cache.get(config.channels["VOTE_COUNT_ID"]);
				if (config.channels["USER_COUNT_ID"])
					userChannel = supportGuild.channels.cache.get(config.channels["USER_COUNT_ID"]);

				if (serverChannel)
					serverChannel.setName(
						config.channels["SERVER_COUNT_NAME"].replace(
							"{count}",
							client.guilds.cache.size
						)
					);
				if (userChannel)
					userChannel.setName(
						config.channels["USER_COUNT_NAME"].replace(
							"{count}",
							client.format(
								client.guilds.cache.reduce(
									(sum: any, guild: any) =>
										sum + (guild.available ? guild.memberCount : 0),
									0
								)
							)
						)
					);

				const votes: any = JSON.parse(fs.readFileSync("./assets/votes.json").toString());

				const date: Date = new Date();
				let month: string = date.toLocaleString("de-DE", {
					month: "long"
				});
				month = month.charAt(0).toUpperCase() + month.slice(1);

				const months: string[] = moment.months();
				const voteMonth: string = months[new Date(Date.now()).getMonth()];
				if (voteChannel) {
					voteChannel.setName(
						config.channels["VOTE_COUNT_NAME"]
							.replace("{count}", client.format(votes[voteMonth.toLowerCase()] || 0))
							.replace("{month}", month)
					);
				}
			}, 120 * 1000);
		}

		/* Cache invites */
		client.guilds.cache.forEach((guild: Guild) => {
			guild.invites
				.fetch()
				.then((invites: Collection<string, Invite>): void => {
					client.invites.set(
						guild.id,
						new Collection(
							invites.map((invite) => [
								invite.code,
								{ uses: invite.uses, inviterId: invite.inviterId }
							])
						)
					);
				})
				.catch((): void => {});
		});

		client.logger.log("Loaded " + client.guilds.cache.size + " guilds");
		client.logger.success(
			"Logged in as " + client.user.displayName + " (@" + client.user.username + ")"
		);

		/* Register interactions, if bot is running on development mode */
		if (process.argv.slice(2)[0] === "--dev") {
			await registerInteractions(client);
		}
	}
}
