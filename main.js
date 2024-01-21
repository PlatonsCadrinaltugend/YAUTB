require('dotenv').config();
Object.assign(global, { WebSocket: require('ws') });
const { parse, formatURI } = require('spotify-uri');
const { stringify } = require('querystring');
var util = require('./Util.js');
var whitelist = require('./whitelist.js');

const oAuth = util.oAuth;
const spotID = process.env.SPOTIFYCLIENTID
const spotSecret = process.env.SPOTIFYCLIENTSECRET;

const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFYREFRESHTOKEN;
const nick = `njdagdoiad`;
const channels = ["deadcr1", "yautb"];
const Messages = false;
var SpotAuth = null;

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
				let userID = await util.getUserIdByUserName("Gaastraa").then(function(data) {return data;}).catch((error) => console.log(error));
				let bool = await userIDIsOnWhitelist(userID).then(function(data) {return data;}).catch((error) => console.log(error));
				console.log(bool);
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
						save(channel, 'channels.json');
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
			let bool = await util.userIDIsOnWhitelist(userID).then(function(data) {return data;}).catch((error) => console.log(error));
			if (bool){
				if (SpotAuth == null){
					const payload = {
						method: 'POST',
						headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Basic ' + (new Buffer.from(spotID + ':' + spotSecret).toString('base64')),
						},
						body: stringify({
						grant_type: 'refresh_token',
						refresh_token: SPOTIFY_REFRESH_TOKEN,
						}),
					}
					await fetch("https://accounts.spotify.com/api/token", payload).then(response => response.json()).then(data => {
						SpotAuth = data["access_token"];
						console.log(data)}).catch(error => console.error(error));
					}
				message = message.split(" ")[2];
				var uri = parse(message)["uri"];
				uri.split("?")[0];
				uri = formatURI(uri);
				console.log(uri);
				fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
					headers: {
					Authorization: `Bearer ${SpotAuth}`
					},
					method: "POST"
				}).catch(error => console.error(error));
			}
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