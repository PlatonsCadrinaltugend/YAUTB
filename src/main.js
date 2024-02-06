require('dotenv').config({path : '../.env'});
Object.assign(global, { WebSocket: require('ws') });
const whitelist = require('./whitelist.js');
const util = require('./util.js');
const modactions = require('./modactions.js');
let standartargs;
const oAuth = util.oAuth;
const fs2= require('fs');
const nick = `njdagdoiad`;
const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
async function init(){
	let util_data = await fs.readFile('../data/util.json', "binary");
	let util_obj = JSON.parse(util_data);
	let whitelist_data = await fs.readFile('../data/whitelist.json', "binary");
	let whitelist_obj = JSON.parse(whitelist_data);
	standartargs = {
		modify:false,
		Messages:false,
		socket:socket,
		util_obj:util_obj,
		whitelist_obj: whitelist_obj
	}
}
init()
socket.addEventListener('open', async () => {
	socket.send(`PASS oauth:${oAuth}`);
	socket.send(`NICK ${nick}`);
	let channels = await (util.getChannelNamesOfJoinedChannels()).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(channels);
	for (var channel of channels) {
		socket.send(`JOIN #${channel}`);
		console.log(`Joined ${channel}`);
		if (standartargs.Messages){
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
				userIDIsOnWhitelist:false
			}
			MessageEvent.originChannelID =await util.getUserIdByUserName(MessageEvent.originChannel);
			MessageEvent.idsender = await util.getUserIdByUserName(MessageEvent.usernameSender);
			MessageEvent.userIDIsOnWhitelist = await whitelist.userIDIsOnWhitelist(MessageEvent.idsender, MessageEvent.originChannelID);
			//lowers botspeed by alot, but thats a problem for another day
			let [usernameSender,originChannel, originChannelID, message, idsender] = [MessageEvent.usernameSender, MessageEvent.originChannel,MessageEvent.originChannelID, MessageEvent.message, MessageEvent.idsender]; 
			let botInChannel = await util.automodActivated(originChannel);
			if (botInChannel){
				let filtertrue =await modactions.filter(MessageEvent.message, standartargs.util_obj);
				if (filtertrue){
					await modactions.banUser(idsender, usernameSender, `Automod detected blocked term`, MessageEvent.userIDIsOnWhitelist, originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));;
				}
			}
		if (message != null && message.startsWith(Prefix)){
			MessageEvent.message = message = util.getMessageWithoutPrefix(message);
			let commandname = message.split(" ")[0];
			console.log(commandname);
			let path = `../commands/${commandname}.js`
			if(fs2.existsSync(path)){
				let command = require(path);
				console.log(command);
				standartargs = await command.execute.code(MessageEvent, standartargs);
				standartargs.util_obj = await (standartargs.util_obj).then(function(data) {return data;}).catch((error) => console.log(error));;
				console.log(standartargs);
			}
			message = util.getMessageWithoutPrefix(message);
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

//TODO Bot part methods and connected spotify (?)
