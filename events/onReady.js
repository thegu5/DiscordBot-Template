/**
 * @file Ready Event File.
 * @author Naman Vrati
 * @since 1.0.0
 */
const { time } = require("console");
const fs = require("fs");
const { threadId } = require("worker_threads");
const fetch = require("sync-fetch");
const diff = require("diff");
module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes the block of code when client is ready (bot initialization)
	 * @param {import("discord.js").Client} client Main Application Client
	 */
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		function getJson() {
			return fetch("https://game-launcher.feathermc.com/release/versions/1.8.9.json").json();
		}
		function update() {
			console.log("function init");
			let localdata = fs.readFile("./1.8.9.json", (err, data) => {
				data = JSON.parse(data);
				console.log("fs done");
				if (err) {
					console.log("oop red alert something went wrong");
					client.channels.cache.get('984117392005271572').send("oopsie error reading data, sorry");
				} else {
					let newdata = getJson();
					console.log(data);
					console.log("---");
					console.log(newdata);
					if (JSON.stringify(data) == JSON.stringify(newdata)) {
						client.channels.cache.get('984117392005271572').send('no difference :O');
					} else {
						client.channels.cache.get('984117392005271572').send('difference detected @everyone');
						client.channels.cache.get('984117392005271572').send("```\n" + diff.createPatch("1.8.9.json", JSON.stringify(data, null, 2), JSON.stringify(newdata, null, 2), "Old", "New", {context: 0}) + "```");
						/*
						client.channels.cache.get('984117392005271572').send("DIFFERNCE WHAFGE");
						let message = "```";
						for (entry in diff(data, newdata)) {
							message += "\n" + entry + ": " + diff(data, newdata)[entry];
						}
						client.channels.cache.get('984117392005271572').send(message + "```");
						*/
						fs.writeFileSync("./1.8.9.json", JSON.stringify(newdata));
					}
				}
			})
		}
		setInterval(update, 5000);
	}
};
