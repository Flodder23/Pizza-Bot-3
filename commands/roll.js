const { userMention } = require("discord.js");

function doRoll(amount, value, drop, penalty, modifier) {
	let options = (amount != 1 ? amount : "")
		+ ("d" + value)
		+ (drop != 0 ? "D" + drop : "")
		+ (penalty != 0 ? "P" + penalty : "")
		+ (modifier != 0 ? (modifier > 0 ? "+" : "") + modifier : "");

	if (amount < 1) {
		return [false, 0, [], [], options, "the `amount` (" + amount + ") entered is too low"];
	}
	if (value < 1) {
		return [false, 0, [], [], options, "the `value` (" + value + ") entered is too low"];
	}
	if (drop < 0) {
		return [false, 0, [], [], options, "the `drop` (" + drop + ") entered is too low"];
	}
	if (penalty < 0) {
		return [false, 0, [], [], options, "the `penalty` (" + penalty + ") entered is too low"];
	}
	if (drop + penalty >= amount) {
		return [false, 0, [], [], options, "the `drop` (" + drop + ") and `penalty` (" + penalty + ") entered is too high for the `amount` (" + amount + ")"];
	}

	let roll = [...Array(amount)].map(_ => Math.ceil(Math.random() * value));
	let result = [...roll].sort((a, b) => a - b).slice(drop, amount - penalty);
	let sum = result.reduce((a, b) => a + b, 0) + modifier;

	let roll_str = roll.reduce((a, b, i) => {
		if (i != 0) { a += ", " };
		let pos = result.findIndex(e => e == b);
		if (pos != -1) { a += "**"; }
		a += b;
		if (pos != -1) {
			a += "**";
			delete result[pos];
		}
		return a;
	}, "")

	return [true, sum, roll, result, options, roll_str];
};

module.exports = {
	data: {
		name: "roll",
		description: "Do a dice roll",
		options: [
			{
				type: 3,
				name: "flags",
				description: "Usual format, eg. 4d8, with extra flags available"
			}, {
				type: 4,
				name: "amount",
				description: "Amount of dice to roll (default: 1, flag: d)",
				minValue: 1
			}, {
				type: 4,
				name: "value",
				description: "Value of the dice (default: 20)",
				minValue: 1
			}, {
				type: 4,
				name: "drop",
				description: "How many lowest dice to ignore (default: 0, flag: D)",
				minValue: 0
			}, {
				type: 4,
				name: "penalty",
				description: "How many highest dice to ignore (default: 0, flag: P)",
				minValue: 0
			}, {
				type: 4,
				name: "modifier",
				description: "Modifier of the roll, ie. value to add on (default: 0, flag: (+|-))"
			}, {
				type: 6,
				name: "user",
				description: "User for whom the roll is being taken"
			}
		]
	},
	async execute(interaction) {
		let flags = interaction.options.getString("flags")?.match(/^(\d+)?(d(\d+))(D(\d+))?(P(\d+))?((\+|-)(\d+))?$/);
		let amount = flags && flags[1] ? Number(flags[1]) : interaction.options.getInteger("amount") ?? 1;
		let value = flags && flags[3] ? Number(flags[3]) : interaction.options.getInteger("value") ?? 20;
		let drop = flags && flags[5] ? Number(flags[5]) : interaction.options.getInteger("drop") ?? 0;
		let penalty = flags && flags[7] ? Number(flags[7]) : interaction.options.getInteger("penalty") ?? 0;
		let modifier = flags && flags[8] ? Number(flags[8]) : interaction.options.getInteger("modifier") ?? 0;

		let [success, sum, , , options, roll_str] = doRoll(amount, value, drop, penalty, modifier);
		if (success) {
			interaction.reply(
				userMention((interaction.options.getUser("user") ?? interaction.user).id)
				+ " rolled **" + sum + "**\n"
				+ "options were `" + options
				+ "`,  roll was " + roll_str
			);
		} else {
			interaction.reply("Sorry, something went wrong - your options were interpreted as `" + options + "` but " + roll_str + ".")
		}
	}
}
