require('dotenv').config({path : '../.env'});
Object.assign(global, { WebSocket: require('ws') });
var util = require('./Util.js');
var whitelist = require('./whitelist.js');
var spotify = require('./spotify.js');
var modactions = require('./modactions.js');
const oAuth = util.oAuth;
var modify = true;
const nick = `njdagdoiad`;
const Messages = false;
const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

socket.addEventListener('open', async () => {
	socket.send(`PASS oauth:${oAuth}`);
	socket.send(`NICK ${nick}`);
	let channels = await (util.getChannelNamesOfJoinedChannels()).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(channels);
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
			let MessageEvent = {
				usernameSender: util.getUsernameByEvent(event),
				originChannel: util.getOriginChannelByEvent(event),
				originChannelID:  null,
				message: util.getMessageContent(event),
				idsender: null,
			}
			MessageEvent.originChannelID =await util.getUserIdByUserName(MessageEvent.originChannel);
			MessageEvent.idsender = await util.getUserIdByUserName(MessageEvent.usernameSender);
			//lowers botspeed by alot, but thats a problem for another day
			let [usernameSender,originChannel, originChannelID, message, idsender] = [MessageEvent.usernameSender, MessageEvent.originChannel,MessageEvent.originChannelID, MessageEvent.message, MessageEvent.idsender]; 
			let botInChannel = await util.automodActivated(originChannel);
			if (botInChannel){
				let filtertrue =await modactions.filter(message);
				if (filtertrue){
					await modactions.banUser(idsender, usernameSender, `Automod detected blocked term`, util.BOTID, originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));;
				}
			}
		if (message != null && message.startsWith(Prefix)){
			message = util.getMessageWithoutPrefix(message);
			console.log(message);
			if (message.startsWith("ban")){
				let username = message.split(" ")[1];
				let id = await util.getUserIdByUserName(username);
				await modactions.banUser(id, username, `Automated Ban By YAUTB. Authorized by ${usernameSender}`, idsender, originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
			}
			if (message.startsWith("unban")){
				let username = message.split(" ")[1];
				let id = await util.getUserIdByUserName(username);
				await modactions.unbanUser(id, idsender, originChannelID);
			}
			if (message.startsWith("timeout")){
				let time = message.split(" ")[2];
				let id = await util.getUserIdByUserName(username);
				await modactions.timeoutUser(id, username, usernameSender, idsender, time, originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
			}
			switch(message.split(" ")[0].toLowerCase()){
				case "skip":{
					if (modify){
						spotify.skipSong(socket, originChannel, idsender, originChannelID);
					}
					break;
				}
				case "song":{
					if (modify){
						spotify.getCurrentSong(socket, originChannel);
					}
					break;
				}
				case "volume":{
					if (modify){
						if (message.split(" ").length == 2){
							spotify.setVolume(message.split(" ")[1], socket, originChannel, idsender);
						}
						else{
							spotify.getVolume(socket, originChannel, idsender);
						}
					}
					break;

				}
				case "deactivate":
				case "activate":{
					//TODO fix codequality
					if (usernameSender == originChannel){
						modify = !modify;
						socket.send(`PRIVMSG #${originChannel} :/me Set Modify-Musik to ${modify}`)
					}
					break;
				}
				case "v":{
					await modactions.timeoutUser(idsender, username, "YAUTB", util.BOTID, 1);
					break;
				}
				case "crossban":{
					if (usernameSender == "deadcr1"){
						if (message.split(" ").length >= 2){
							let username = message.split(" ")[1];
							let message2 = message.split(" ");
							message2.shift();
							message2.shift();
							console.log(message2);
							let reason = message2.join(" ");
							console.log(reason);
							let id = await util.getUserIdByUserName(username);
							await modactions.crossban(id, username, idsender, originChannel, reason);
						}
						else{
							socket.send(`PRIVMSG #${originChannel} :/me Usage: !crossban <user> <reason>`)
						}
					}
					break;
				}
				case "enableautomod":
					await util.setAutomod(idsender, true);
					socket.send(`PRIVMSG #${originChannel} :/me Enabled automod for your channel ApuApproved`)
					break;
				case "disableautomod":
					await util.setAutomod(idsender, false);
					socket.send(`PRIVMSG #${originChannel} :/me Disabled automod for your channel ApuApproved`)
					break;
				case "enablecrossban":
					await modactions.enableCrossban(idsender, true);
					socket.send(`PRIVMSG #${originChannel} :/me Enabled crossbans for your channel ApuApproved`)
					break;
				case "disablecrossban":{
					await modactions.enableCrossban(idsender, false);
					socket.send(`PRIVMSG #${originChannel} :/me Disabled crossbans for your channel ApuApproved`)
					break;
				}
				case "idea":{
					let list = message.split(" ");
					list.splice(0,1);
					list = list.join(" ");
					if (list && list != null){
						util.saveIdea(list);
						socket.send(`PRIVMSG #${originChannel} :Saving your idea. Thank you for your help improving this bot luvv`);
					}else{
						socket.send(`PRIVMSG #${originChannel} :/me Usage: !idea <idea>`);
					}
					break;
				}
				case "shutdown":{
					if (usernameSender == "deadcr1" && originChannel == "yautb"){
						let channels = await (util.getChannelNamesOfJoinedChannels()).then(function(data) {return data;}).catch((error) => console.log(error));
						for (var channel of channels) {
							if (Messages){
								socket.send(`PRIVMSG #${channel} :Deadge`);
							}
						}
						socket.close();
					}
					else{
						socket.send(`PRIVMSG #${originChannel} :An Error occured, either you have insufficient privileges or this is not the right channel.`)
					}
					break;
				}
				case "play":{
					spotify.addSongToQueue(idsender, message, originChannelID);
					break;
				}
				case "addtoownchannel":{
					if (usernameSender) {
						userId = await util.getUserIdByUserName(usernameSender).then(function(data) {return data;}).catch((error) => console.log(error));
							var channel = {
								"name": usernameSender,
								"id": userId,
								"crossban":true,
								"automod":true
							}
							console.log(`Username: ${usernameSender}, User ID: ${userId}`);
							socket.send(`PRIVMSG #${usernameSender} :Hello there :D`);
							socket.send(`PRIVMSG #${originChannel} :I sucessfully joined your Channel ApuApproved`);
							util.saveChannel(channel, '../data/util.json');
							socket.send(`JOIN #${usernameSender}`);
							console.log(`Joined ${usernameSender}`);
						}
						break;
					}
				default: {
					break;
				} 
			}
		}
		switch(message){
			case "kok": {
				socket.send(`PRIVMSG #${originChannel} :kok`);
				break;
			}
			default: break;
		}
		if (message != null && (usernameSender == originChannel || usernameSender =="deadcr1")){
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
						whitelist.saveWhitelist(userId, originChannel, username, remove, socket, originChannelID);
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

//TODO Bot join and part methods, saving channel and connected spotify (?)

//TODO store all data in a json, save in relation to channel
