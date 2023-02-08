const { userMention } = require("discord.js");

module.exports = {
	data: {
		name: "avatar",
		description: "Fetch a user's avatar",
		options: [
			{
				type: 6,
				name: "user",
				description: "User whose avatar to fetch"
			}
		]
	},

	async execute(interaction) {
		const user = interaction.options.getUser("user") ?? interaction.user;

		return interaction.reply({
			content: `${userMention(user.id)}'s avatar:`,
			embeds: [{ image: { url: user.displayAvatarURL({ size: 4096 }) } }]
		});
	}
};