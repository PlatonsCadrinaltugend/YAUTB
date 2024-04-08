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
let eventsub = new WebSocket("wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=600");
let eventid;
ROLES =  {
	USER:1,
	CHANNEL_MODERATOR:2,
	MODERATOR:3,
	ADMIN:4
}
async function init(){
	let util_data = await fs.readFile('../data/util.json', "utf8");
	let util_obj = JSON.parse(util_data);
	let commands_data = await fs.readFile('../data/customcommands.json', "utf8");
	let command_obj = JSON.parse(commands_data);
	let whitelist_data = await fs.readFile('../data/whitelist.json', "binary");
	let whitelist_obj = JSON.parse(whitelist_data);
	standartargs = {
		modify:false,
		Messages:false,
		socket:socket,
		util_obj:util_obj,
		whitelist_obj: whitelist_obj,
		command_obj:command_obj,
		eventsub:eventsub,
		eventid:eventid
	}
	open("wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=600");
}
init()
function open(link){
	eventsub = new WebSocket(link);
	standartargs.eventsub = eventsub;
}
eventsub.addEventListener('message', async event=>{
	console.log(event.data);
	let data = JSON.parse(event.data);
	console.log(data);
	if (data.metadata.message_type == "session_welcome"){
		eventid = data.payload.session.id;
		standartargs.eventid = eventid;
		for (var elem of Object.keys(standartargs.util_obj.subscribed)){
			util.joinlivemsg(standartargs, elem);
		}
	}
	if (data.metadata.message_type == "notification"){
		if (data.payload.subscription.type == "stream.online"){
			let id = data.event.broadcaster_user_id;
			let user = data.event.broadcaster_user_name;
			util.notifyChannels(standartargs, id, user);
		}
	}
	if (data.metadata.message_type == "session_reconnect"){
		open(data.payload.reconnect_url);
		eventsub.close();
	}
	if (event.data.includes("PING")) {
		eventsub.send("PONG");
	}
})


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
				userAccess:ROLES.USER,
				messages:false
			}
			console.log(MessageEvent.message);
			MessageEvent.originChannelID =await util.getUserIdByUserName(MessageEvent.originChannel);
			MessageEvent.idsender = await util.getUserIdByUserName(MessageEvent.usernameSender);
			MessageEvent.userAccess = await whitelist.userAccess(MessageEvent, standartargs, MessageEvent.idsender);
			MessageEvent.messages = util.getMessages(MessageEvent, standartargs);
			console.log(MessageEvent.userAccess);
			console.log(MessageEvent.messages);
			if (MessageEvent.messages == false && MessageEvent.userAccess < ROLES.ADMIN){
				console.log(MessageEvent.userAccess);
				return;
			}
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
				if (MessageEvent.userAccess >= command.execute.Roles ){
					standartargs = await command.execute.code(MessageEvent, standartargs);
					standartargs.util_obj = await Promise.resolve(standartargs.util_obj).then(function(data) {return data;}).catch((error) => console.log(error));
				// console.log(standartargs);
				}

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