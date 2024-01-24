var whitelist = require('./whitelist.js');
var util = require('./Util.js');

exports.banUser = async function banUser (id, username, usernameSender, idsender, originChannelID){
	//TODO make sure the bot can ban users with @ prefix and moderators (optional)
	let bool = await whitelist.userIDIsOnWhitelist(idsender);
	if (bool){
		console.log(idsender);
		//currently only for my channel
		const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${BOTID}`, {
			body: JSON.stringify({
				"data": {
					"user_id":`${id}`,
					"reason":`Automated Ban By YAUTB. Authorized by ${usernameSender}`
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
	let bool = await whitelist.userIDIsOnWhitelist(idsender);
	if (bool){
		const response = fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${BOTID}&user_id=${id}`, {
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
	bool = await whitelist.userIDIsOnWhitelist(idsender);
	if (bool){
		//currently only for my channel
		const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${originChannelID}&moderator_id=${BOTID}`, {
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