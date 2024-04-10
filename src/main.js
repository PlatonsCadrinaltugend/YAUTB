require('dotenv').config({path : '../.env'});
Object.assign(global, { WebSocket: require('ws') });
const whitelist = require('./whitelist.js');
const util = require('./util.js');
let standartargs;
const oAuth = util.oAuth;
const fs2= require('fs');
const nick = `njdagdoiad`;
const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
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
	let whitelist_data = await fs.readFile('../data/whitelist.json', "utf8");
	let whitelist_obj = JSON.parse(whitelist_data);
	standartargs = {
		modify:false,
		Messages:false,
		socket:socket,
		util_obj:util_obj,
		whitelist_obj: whitelist_obj,
		command_obj:command_obj
	}
}
init()


socket.addEventListener('open', async () => {
	socket.send(`PASS oauth:${oAuth}\r\n`);
	socket.send(`NICK ${nick}\r\n`);
	let channels = await (util.getChannelNamesOfJoinedChannels()).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(channels);
	for (var channel of channels) {
		socket.send(`JOIN #${channel}\r\n`);
		console.log(`Joined ${channel}`);
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
			if (MessageEvent.originChannel == null || MessageEvent.usernameSender == null || MessageEvent.message == null){
				return;
			}
			MessageEvent.originChannelID =await util.getUserIdByUserName(MessageEvent.originChannel);
			MessageEvent.idsender = await util.getUserIdByUserName(MessageEvent.usernameSender);
			MessageEvent.userAccess = userAccess = await whitelist.userAccess(standartargs, MessageEvent.idsender);
			if (userAccess<ROLES.MODERATOR){
				if (await Promise.resolve(await util.isMod(MessageEvent.originChannel, MessageEvent.idsender)).then(function(data){return data;}).catch((error) => console.log(error))){
					MessageEvent.userAccess = ROLES.CHANNEL_MODERATOR;
				}
			}
			MessageEvent.messages = util.getMessages(MessageEvent, standartargs);
			message = MessageEvent.message;
		if (message != null && message.startsWith(Prefix)){
			MessageEvent.message = message = util.getMessageWithoutPrefix(message);
			let commandname = message.split(" ")[0];
			console.log(commandname);
			let path = `../commands/${commandname}.js`	
			if(fs2.existsSync(path)){
				let command = require(path);
				console.log(command);
				if (MessageEvent.userAccess >= command.execute.Roles ){
					standartargs = await Promise.resolve(await command.execute.code(MessageEvent, standartargs)).then(function(data) {return data;}).catch((error) => console.log(error));
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