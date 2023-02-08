const { userMention } = require("discord.js");

getRegionalIndicator = i => String.fromCodePoint(127462 + i)

module.exports = {
	data: {
		name: "poll"
	},
	async execute(interaction) {
		const question = interaction.fields.fields.get("question").value;
		const options = interaction.fields.fields.get("options").value.split("\n");

		let option_count = 0;
		const reply = await interaction.reply({
			content: `${userMention(interaction.user.id)}'s poll: **${question}**?`,
			embeds: [{
				description: options.map(o => {
					if (o == "") {
						return "";
					}

					option_count++;
					return `${getRegionalIndicator(option_count - 1)} - ${o}`;
				}).join("\n")
			}],
			fetchReply: true
		});

		for (let i = 0; i < option_count; i++) {
			await reply.react(getRegionalIndicator(i))
		}
	}
}
