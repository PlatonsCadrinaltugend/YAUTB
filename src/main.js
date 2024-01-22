require('dotenv').config({path : '../.env'});
Object.assign(global, { WebSocket: require('ws') });
var util = require('./Util.js');
var whitelist = require('./whitelist.js');
var spotify = require('./spotify.js');
var modactions = require('./modactions.js');
const oAuth = util.oAuth;
const BOTID = util.BOTID;
const nick = `njdagdoiad`;
const channels = ["deadcr1", "yautb"];
const Messages = false;
const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

socket.addEventListener('open', () => {
	socket.send(`PASS oauth:${oAuth}`);
	socket.send(`NICK ${nick}`);
	for (var channel of channels) {
		socket.send(`JOIN #${channel}`);
		console.log(`Joined ${channel}`);
		if (Messages){
			socket.send(`PRIVMSG #${channel} :kok`);
		}
	}
})

socket.addEventListener('message', async event => {
	if (socket.readyState === WebSocket.OPEN) {
		if (!event.data.includes(":tmi.twitch.tv")){
			const usernameSender = util.getUsernameByEvent(event);
			const originChannel = util.getOriginChannelByEvent(event);
			var message = util.getMessageContent(event);
			console.log(`Message: ${message}.`);
		if (message != null && message.startsWith(Prefix)){
			message = util.getMessageWithoutPrefix(message);
			console.log(message);
			let idsender = await util.getUserIdByUserName(usernameSender);
			if (message.startsWith("ban")){
				let username = message.split(" ")[1];
				let id = await util.getUserIdByUserName(username);
				await modactions.banUser(id, username, usernameSender, idsender).then(function(data) {return data;}).catch((error) => console.log(error));
			}
			if (message.startsWith("unban")){
				let username = message.split(" ")[1];
				let id = await util.getUserIdByUserName(username);
				await modactions.unbanUser(id);
			}
			if (message.startsWith("timeout")){
				let time = message.split(" ")[2];
				await modactions.timeoutUser(id, username, usernameSender, idsender, time).then(function(data) {return data;}).catch((error) => console.log(error));
			}
			switch(message){
				case "song":{
					spotify.getCurrentSong(socket, originChannel);
					break;
				}
				default: {
					socket.send(`PRIVMSG #${originChannel} :No such command found`);
					break;
				} 
			}
		}
		switch(message){
			case "kok ppPoof": {	
				if (usernameSender == "deadcr1" && originChannel == "yautb"){
					for (var channel of channels) {
						if (Messages){
							socket.send(`PRIVMSG #${channel} :ppPoof`);
						}
					}
					socket.close();
				}
				break;
			}
			case "kok": {
				socket.send(`PRIVMSG #${originChannel} :kok`);
				break;
			}
			case "kok add kok": {
				if (usernameSender) {
					userId = await util.getUserIdByUserName(usernameSender).then(function(data) {return data;}).catch((error) => console.log(error));
						var channel = {
							"name": usernameSender,
							"id": userId,
						}
						console.log(`Username: ${usernameSender}, User ID: ${userId}`);
						save(channel, '../data/channels.json');
					}
				}
			default: break;
		}
		if (message != null && usernameSender == "deadcr1"){
			if (message.startsWith("kok whitelist")){
				var remove = false;
				if (message.startsWith("kok whitelist remove")){
					remove = true;
					var username = message.split("kok whitelist remove ")[1];
				}else{
					var username = message.split("kok whitelist ")[1];
				}
					if (username) {
						let userId = await util.getUserIdByUserName(username).then(function(data) {return data;}).catch((error) => console.log(error));
						whitelist.saveWhitelist(userId, originChannel, username, remove, socket);
					}
			}
		}
		if (message != null && message.startsWith("kok play ")){
			let userID = await util.getUserIdByUserName(usernameSender).then(function(data) {return data;}).catch((error) => console.log(error));
			spotify.addSongToQueue(userID, message);
		}
	}
	// Respond to PING requests
	if (event.data.includes("PING")) {
		socket.send("PONG");
	}
}});

socket.addEventListener('error', error => {
	console.error('WebSocket error:', error);
});

socket.addEventListener('close', event => {
	console.log('WebSocket closed:', event);
});

// //TODO Bot join and part methods, saving channel and connected spotify (?)