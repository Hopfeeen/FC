import * as fs from "fs";
import { scheduleJob } from "node-schedule";
import moment from "moment";
import {Collection, ComponentType, Guild, Invite, AttachmentBuilder, EmbedBuilder, ButtonBuilder } from "discord.js";
import { Player } from "discord-player";

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

import evaluateVoiceTimeStatistics from "@handlers/evaluateVoiceStatistics";
import createBundesligaGameEvent from "@handlers/createBundesligaGameEvent";
import evaluateMessageStatistics from "@handlers/evaluateMessageStatistics";
import selkeSamtag from "@handlers/selkeSamstag"

import dashboard from "@dashboard/app";
import api from "@api/app";
import BaseClient from "@structures/BaseClient";

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

		/* FC Bot specials */
		scheduleJob("0 0 * * *", async (): Promise<void> => {
			await evaluateMessageStatistics(client);
			await evaluateVoiceTimeStatistics(client);
			await createBundesligaGameEvent(client)
		});

		scheduleJob("0 0 * * 6", async (): Promise<void> => {
			await selkeSamtag(client)
			})



		/* Initiate music player */
		const player = new Player(client, {
			useLegacyFFmpeg: false,
			skipFFmpeg: false,
			ytdlOptions: {
				quality: "highestaudio",
				highWaterMark: 1 << 25,
				requestOptions: {
					headers: {
						cookie: client.config.apikeys.GOOGLE_COOKIE
					}
				}
			}
		});
		await player.extractors.loadDefault();
		client.player = player;


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
