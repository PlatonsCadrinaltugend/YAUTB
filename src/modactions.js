var whitelist = require('./whitelist.js');
var util = require('./Util.js');

exports.banUser = async function banUser (id, username, reason, idsender, originChannelID){
	//TODO make sure the bot can ban users with @ prefix and moderators (optional)
	let bool = await whitelist.userIDIsOnWhitelist(idsender, originChannelID);
	if (bool){
		const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${util.BOTID}`, {
			body: JSON.stringify({
				"data": {
					"user_id":`${id}`,
					"reason":reason
				}
			}),
		headers: {
			Authorization: `Bearer ${oAuth}`,
			"Client-Id": util.CLIENT_ID,
			"Content-Type": "application/json"
		},
		method: "POST"
		}).then(console.log(`Banned User ${username}`)).catch((error) => console.log(error));
	}
}

exports.unbanUser = async function unbanUser (id, idsender, originChannelID){
	let bool = await whitelist.userIDIsOnWhitelist(idsender, originChannelID);
	if (bool){
		const response = fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${util.BOTID}&user_id=${id}`, {
			headers: {
			Authorization: `Bearer ${oAuth}`,
			"Client-Id": util.CLIENT_ID
			},
			method: "DELETE"
		}) 
	}

}

exports.timeoutUser = async function timeoutUser (id, username, usernameSender, idsender, time, originChannelID){
	//TODO make sure the bot can ban users with @ prefix and moderators (optional)
	bool = await whitelist.userIDIsOnWhitelist(idsender, originChannelID);
	if (bool){
		const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${util.BOTID}`, {
			body: JSON.stringify({
				"data": {
					"user_id":`${id}`,
                    "duration": time,
					"reason":`Automated Timeout By YAUTB. Authorized by ${usernameSender}`
				}
			}),
		headers: {
			Authorization: `Bearer ${oAuth}`,
			"Client-Id": util.CLIENT_ID,
			"Content-Type": "application/json"
		},
		method: "POST"
		}).then(console.log(`Timeouted User ${username} for ${time} seconds`)).catch((error) => console.log(error));
	}
}

exports.crossban = async function crossban (UserID, username, idsender, originChannel, reason){
	let data = await fs.readFile('../data/util.json', "binary");
	const obj = JSON.parse(data);
	let list = Array.from(obj["list"]);
	console.log(list);
	for (var channel of list){
		console.log(channel.crossban);
		if (channel.crossban){
			await this.banUser(UserID, username,`Automated Crossban By YAUTB. Used in ${originChannel}. Reason: ${reason}`, idsender, channel.id);
		}
	}
	console.log("CROSSBAN SUCESSFUL");
}

exports.enableCrossban = async function enableCrossban(idsender, bool){
	let data = await fs.readFile('../data/util.json', "binary");
	const obj = JSON.parse(data);
	let list = Array.from(obj["list"]);
	for (var channel of list){
		if (channel.id == idsender){
			channel.crossban = bool;
		}
	}
	obj["list"] = list;
	save(obj, '../data/util.json');

}

exports.filter = async function filter(message){
	let data = await fs.readFile('../data/util.json', "binary");
	const obj = JSON.parse(data);
	let list = Array.from(obj["blacklisted_terms"]);
	for (var elem of list){
		if (message.includes(elem)){
			return true;
		}
	}
	return false;
}