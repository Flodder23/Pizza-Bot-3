const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const token = process.env.TOKEN ?? require('./config.json').token;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

// set up events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// set up other handlers
const handlerTypes = ["commands", "modals"];
for (const handlerType of handlerTypes) {
	client[handlerType] = new Collection();
	const handlersPath = path.join(__dirname, handlerType);
	const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

	for (const file of handlerFiles) {
		const filePath = path.join(handlersPath, file);
		const handler = require(filePath);
		client[handlerType].set(handler.data.name, handler);
	}
}

client.login(token);
