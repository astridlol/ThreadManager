import { ArgsOf, Discord, On } from 'discordx';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';

@Discord()
export class MessageCreate {
	@On({
		event: 'messageCreate'
	})
	async onJoin(
		[msg]: ArgsOf<'messageCreate'> // Type message automatically
	) {
		const chnl = msg.channel;

		const pollsChannel = process.env.POLLS_CHANNEL!!;
		const sotdChannel = process.env.SOTD_CHANNEL!!;

		if (![pollsChannel, sotdChannel].includes(chnl.id)) return;
		if (chnl.type !== ChannelType.GuildText && chnl.type !== ChannelType.GuildAnnouncement) return;

		if (chnl.id === pollsChannel) {
			const poll = msg.content.split('\n')[2];

			await chnl.threads.create({
				name: poll,
				autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
				reason: `Created for the "${poll}" poll.`,
				startMessage: msg
			});
		} else if (chnl.id === sotdChannel) {
			// Extract the number of the SOTD.
			const matches = msg.content.match(/\d+/);

			if (matches && matches.length > 0) {
				const title = `SOTD #${matches[0]}`;

				await chnl.threads.create({
					name: title,
					autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
					reason: `Created for ${title}`,
					startMessage: msg
				});
			}
		}
	}
}
