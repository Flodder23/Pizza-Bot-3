module.exports = {
	data: {
		name: "ping",
		description: "replies with pong"
	},
	async execute(interaction) {
		const sent = await interaction.reply({ content: `Pinging...`, fetchReply: true });
		interaction.editReply(`Websocket heartbeat: ${interaction.client.ws.ping}ms.\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
