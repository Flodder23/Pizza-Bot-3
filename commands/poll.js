module.exports = {
	data: {
		name: "poll",
		description: "Make a reaction-based poll"
	},
	async execute(interaction) {
		await interaction.showModal({
			title: "Poll",
			customId: "poll",
			components: [{
				type: 1,
				customId: "question",
				components: [{
					type: 4,
					customId: "question",
					label: "Question",
					style: 1,
					placeholder: "Put your question here",
				}]
			}, {
				type: 1,
				customId: "options",
				components: [{
					type: 4,
					customId: "options",
					label: "Options",
					style: 2,
					placeholder: "Put your options here\nseparated by a new line\nlike this",
				}]
			}]
		})
	}
}
