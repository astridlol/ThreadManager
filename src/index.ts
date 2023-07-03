import 'reflect-metadata';

import { importx } from '@discordx/importer';
import { Client } from 'discordx';
import { IntentsBitField } from 'discord.js';

require('dotenv').config();

export const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessages
	],
	silent: false
});

client.on('ready', async () => {
	console.log('> Bot online, logged in as: ' + client.user!!.tag);
});

async function start() {
	await importx(__dirname + '/events/*.{js,ts}');
	await client.login(process.env.TOKEN!!);
}

start();
