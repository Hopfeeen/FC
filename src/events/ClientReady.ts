import * as fs from "fs";
import { scheduleJob } from "node-schedule";
import moment from "moment";
import { Collection, Guild, Invite } from "discord.js";

import handlePresence from "@handlers/presence";
import registerInteractions from "@handlers/registerInteractions";
import TOPGG from "@helpers/Top.gg";
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

		scheduleJob("40 20 * * *", async (): Promise<void> => {
            const messagesFile: any = JSON.parse(fs.readFileSync("./assets/messages.json"));
            const count: number = messagesFile?.count || 0;
            const writers: number = messagesFile?.writer.length || 0;
            let nevarEmbed;
			if (count < 100){
				nevarEmbed = this.client.createEmbed("Ein depremierender Tag für unseren Server! Heute wurden leider nur **{0} Messages** geschrieben. Dabei waren **{1} Menschen** beteiligt. Danke für eure Aktivität <3", null, "normal", count, writers);
				nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175891378211926066/HectorMessages0-100.png?ex=656ce12f&is=655a6c2f&hm=f9f22670e79a5b7181c74326ba12bf82653f0092be42e4f107145ea23173b796&");
			}
			if (count > 500 < 100){
				nevarEmbed = this.client.createEmbed("Hey, morgen wirds besser! Heute wurden **{0} Messages** geschrieben. Dabei haben **{1} Menschen** geschrieben. Danke für eure Aktivität <3 ", null, "normal", count, writers);
				nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175892447000281179/8cfb1468-4d89-4af2-9657-77295ce53c32.png?ex=656ce22e&is=655a6d2e&hm=56dabc7036a13db119a378ff06cb22f6b75741642364b1bb734cb1741f2cdb4a&")
			}
			if (count > 1000 < 500){
				nevarEmbed = this.client.createEmbed("Klasse! Heute wurden **{0} Messages** von **{1} Personen** geschrieben! Danke für eure Aktivität <3", null, "normal", count, writers);
				nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175893445932499065/image-fotor-20231119211945.png?ex=656ce31c&is=655a6e1c&hm=0b60780e61cbbe8a053e4a483a5b8d869f94090231fc247196e0b3e2cacc5789&")
			}
			if (count > 1500 < 1000){
				nevarEmbed = this.client.createEmbed("Sehr Stark!!! Alleine heute wurden **{0} Messages** geschrieben. Dabei haben **{1} Leute** geholfen! Vielen Dank für eure Aktivität <3", null, "normal", count, writers);
				nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175894350564180038/team.png?ex=656ce3f4&is=655a6ef4&hm=6269796f6c039a58475ce50a4507ccea15a5e7f99aca2c3f769113e8a204535f&")
			}
			if (count > 1500){
				nevarEmbed = this.client.createEmbed("Wenn selbst Hennes stolz ist, dann wisst ihr, ihr habts geschafft! Heute wurden **{0} Messages** von insgesamt **{1} Menschen** geschrieben! Vielen Dank für eure Aktivität <3", null, "normal", count, writers);
				nevarEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175895372548288613/mit-hipsterbaertchen-voll-im.png?ex=656ce4e7&is=655a6fe7&hm=d7c6a8cf18dae2245231c243fc65323b0a2afaee96083a088690ae30e169db55&")
			}
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);
            const channel: any = guild.channels.cache.get("813887099065073714");
            channel.send({embeds:[nevarEmbed]});

            console.log(count + " Nachrichten, " + writers + " Schreiber");
            fs.writeFileSync("./assets/messages.json", JSON.stringify({}));
        });

		scheduleJob("0 0 * * 6", async (): Promise<void> => {
			const guild: any = this.client.guilds.cache.get(this.client.config.support["ID"]);
			const channel: any = guild.channels.cache.get("813887099065073714");
			const schonlauSamstag: any = this.client.createEmbed("Es ist wieder soweit... **Es ist...**", null, "normal");
			schonlauSamstag.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175857152598999192/SelkeSamstag.png?ex=656cc14f&is=655a4c4f&hm=9ae60215fa91e52d215ef7e1888034698fcbb53ebf1e23118d3ac9ee74c71967&");
			channel.send({ embeds: [schonlauSamstag] });
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
