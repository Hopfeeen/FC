import { ChannelType, EmbedBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient";
import fs from "fs";

export default class {
	private client: BaseClient;

	public constructor(client: BaseClient) {
		this.client = client;
	}

	public async dispatch(oldVoiceState: any, newVoiceState: any): Promise<any> {
		if (!oldVoiceState || !newVoiceState) return;

		const { member: oldMember, channel: oldChannel } = oldVoiceState;
		const { member: newMember, channel: newChannel, guild } = newVoiceState;

		const guildData: any = await this.client.findOrCreateGuild(guild.id);

		/* Voice statistics */
		const voiceStatisticsFile: any = JSON.parse(fs.readFileSync("./assets/voice_statistics.json").toString());
		if(!voiceStatisticsFile.userJoinTime) voiceStatisticsFile.userJoinTime = {};
		if(!voiceStatisticsFile.userVoiceTime) voiceStatisticsFile.userVoiceTime = {};
		if(!voiceStatisticsFile.userAfkSince) voiceStatisticsFile.userAfkSince = {};

		const voiceStateUpdateDate: any = Date.now();

		if(newChannel){
			if(newChannel?.members.size < 2 || newVoiceState.mute || newVoiceState.deaf){
				if(!voiceStatisticsFile.userAfkSince[newMember.id]) voiceStatisticsFile.userAfkSince[newMember.id] = voiceStateUpdateDate;
			}
			if(newChannel?.members.size >= 2){
				for(const newVoiceChannelMember of newChannel.members.values()){
					if(voiceStatisticsFile.userAfkSince[newVoiceChannelMember.id] && !newVoiceChannelMember.voice.deaf && !newVoiceChannelMember.voice.mute && (newVoiceChannelMember.id !== newMember.id)){
						delete voiceStatisticsFile.userAfkSince[newVoiceChannelMember.id];
					}
				}

				if(voiceStatisticsFile.userAfkSince[newMember.id] && !newVoiceState.deaf && !newVoiceState.mute){
					const userJoinDate: any = voiceStatisticsFile.userJoinTime[newMember.id];
					const userVoiceTime: any = Date.now() - userJoinDate;
					const voiceMinutes: any = userVoiceTime / 60000;

					const userAfkSince: any = voiceStatisticsFile.userAfkSince[newMember.id];
					const userAfkTime: any = Date.now() - userAfkSince;
					const afkMinutes: any = userAfkTime / 60000;

					/* Not afk minutes */
					const countedMinutes: any = voiceMinutes - afkMinutes;


					delete voiceStatisticsFile.userAfkSince[newMember.id];
					voiceStatisticsFile.userVoiceTime[newMember.id] = (voiceStatisticsFile.userVoiceTime[newMember.id] || 0) + countedMinutes;
					voiceStatisticsFile.userJoinTime[newMember.id] = voiceStateUpdateDate;
				}
			}
		}
		if(oldChannel){
			if(oldChannel?.members.size < 2){
				for(const oldVoiceChannelMember of oldChannel.members.values()){
					voiceStatisticsFile.userAfkSince[oldVoiceChannelMember.id] = voiceStateUpdateDate;
				}
			}
		}

		if(!oldChannel && newChannel){
			voiceStatisticsFile.userJoinTime[newMember.id] = voiceStateUpdateDate;
		}else if(!newChannel && oldChannel){
			const userJoinDate: any = voiceStatisticsFile.userJoinTime[oldMember.id];
			const userVoiceTime: any = Date.now() - userJoinDate;

			let countedMinutes: any = userVoiceTime / 60000;

			if(voiceStatisticsFile.userAfkSince[oldMember.id]){
				const userAfkSince: any = voiceStatisticsFile.userAfkSince[oldMember.id];
				const userAfkTime: any = Date.now() - userAfkSince;
				const afkMinutes: any = userAfkTime / 60000;
				countedMinutes = countedMinutes - afkMinutes;
				delete voiceStatisticsFile.userAfkSince[oldMember.id];
			}

			delete voiceStatisticsFile.userJoinTime[oldMember.id];
			voiceStatisticsFile.userVoiceTime[oldMember.id] = (voiceStatisticsFile.userVoiceTime[oldMember.id] || 0) + countedMinutes;
		}
		fs.writeFileSync("./assets/voice_statistics.json", JSON.stringify(voiceStatisticsFile, null, 2));

		if (newChannel && guild) {
			if (!guildData.settings?.joinToCreate?.enabled || !guildData.settings?.joinToCreate?.channel) return;

			const user: any = await this.client.users.fetch(newMember.id).catch((e: any): void => {});

			const channelName: string = guildData.settings.joinToCreate.defaultName
				.replaceAll("{count}", guildData.settings.joinToCreate.channels?.length || 1)
				.replaceAll("{user}", user.displayName);

			/* Create temp channel */
			if (newVoiceState.channel.id === guildData.settings.joinToCreate.channel) {
				const tempChannel: any = await guild.channels
					.create({
						name: channelName,
						reason: "Join to create",
						type: ChannelType.GuildVoice,
						parent: guildData.settings.joinToCreate.category
							? guildData.settings.joinToCreate.category
							: newMember.channel.parentId,
						bitrate: parseInt(guildData.settings.joinToCreate.bitrate) * 1000,
						position: newMember.channel.rawPosition,
						userLimit: guildData.settings.joinToCreate.userLimit
					})
					.catch((e: any): any => {
						const errorText: string =
							this.client.emotes.channel + " Nutzer/-in: " + newMember.user.displayName + " (@" + newMember.user.username + ")";

						const errorEmbed: EmbedBuilder = this.client.createEmbed(errorText, null, "error");
						errorEmbed.setTitle(this.client.emotes.error + " Erstellen von Join2Create-Channel fehlgeschlagen");

						return guild.logAction(errorEmbed, "guild");
					});

				if (tempChannel) {
					await tempChannel.lockPermissions();
					await tempChannel.permissionOverwrites
						.create(newMember.member.user, {
							Connect: true,
							Speak: true,
							ViewChannel: true,
							ManageChannels: true,
							Stream: true,
							MuteMembers: true,
							DeafenMembers: true,
							MoveMembers: false
						})
						.catch((e: any): void => {});

					await newMember.voice
						.setChannel(tempChannel)
						.catch((): void => {
							tempChannel.delete().catch((e: any): void => {});
						})
						.then(async (e: any): Promise<void> => {
							guildData.settings.joinToCreate.channels.push(tempChannel.id);
							guildData.markModified("settings.joinToCreate");
							await guildData.save();
						});
				}
			}
		}

		if (oldChannel && guild) {
			if (guildData.settings?.joinToCreate?.channels?.includes(oldChannel.id)) {
				if (oldChannel.members.size >= 1) return;
				await oldChannel.delete().catch((e: any): void => {
					const errorText: string = this.client.emotes.channel + " Nutzer/-in: " + newMember;

					const errorEmbed: EmbedBuilder = this.client.createEmbed(errorText, null, "error");
					errorEmbed.setTitle(this.client.emotes.error + " Löschen von Join2Create-Channel fehlgeschlagen");

					return guild.logAction(errorEmbed, "guild");
				});
				guildData.settings.joinToCreate.channels = guildData.settings.joinToCreate.channels.filter((c: any): boolean => c !== oldChannel.id);
				guildData.markModified("settings.joinToCreate");
				await guildData.save();
			}
		}
	}
}