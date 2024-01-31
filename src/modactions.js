const util = require('./util.js');

/**
 * Function that requests the ban of a User per Twitch-Api.
 * - id: ID of the user in question.
 * - username: username of the User in question.
 * - reason: reason for the ban.
 * - userIDIsOnWhitelist: is the User that tries to ban whitelisted in this channel.
 * - originChannelID: the ID of the Channel where the User should be banned.
 * @typedef {{id: String, username: String, reason: String,
 *            userIDIsOnWhitelist: boolean, originChannelID: String}}
 */
exports.banUser = async function banUser (id, username, reason, userIDIsOnWhitelist, originChannelID){
		if (userIDIsOnWhitelist){
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

exports.unbanUser = async function unbanUser (id, userIDIsOnWhitelist, originChannelID){
	if (userIDIsOnWhitelist){
		const response = fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${util.BOTID}&user_id=${id}`, {
			headers: {
			Authorization: `Bearer ${oAuth}`,
			"Client-Id": util.CLIENT_ID
			},
			method: "DELETE"
		}) 
	}

}

exports.timeoutUser = async function timeoutUser (id, username, usernameSender, userIDIsOnWhitelist, time, originChannelID){
	if (userIDIsOnWhitelist){
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

exports.crossban = async function crossban (UserID, username, idsender, originChannel, reason, obj){
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

exports.enableCrossban = async function enableCrossban(idsender, bool, obj){
	let list = Array.from(obj["list"]);
	for (var channel of list){
		if (channel.id == idsender){
			channel.crossban = bool;
		}
	}
	obj["list"] = list;
	save(obj, '../data/util.json');
	return obj;
}

exports.filter = async function filter(message, obj){
	let list = Array.from(obj["blacklisted_terms"]);
	for (var elem of list){
		if (message.includes(elem)){
			return true;
		}
	}
	return false;
}