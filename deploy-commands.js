const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const token = process.env.TOKEN;
if (!token) {
	token = require('./config.json');
}
const clientId = process.env.CLIENT_ID;
if (!clientId) {
	clientId = require('./config.json');
}

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log(`adding command ${file}`);
	const command = require(`./commands/${file}`);
	commands.push(command.data);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
