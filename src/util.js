exports.CLIENT_ID = CLIENT_ID = process.env.CLIENTID;
exports.oAuth = oAuth = process.env.TWITCHTOKEN;
const axios = require('axios');
exports.FileSystem = FileSystem = require('fs');
exports.Prefix = Prefix = "Y!";
exports.BOTID = BOTID = "1013898275";


exports.getUserIdByUserName = async function getUserIdByUserName(Username){
	let userID = null;
	const user_info_url = `https://api.twitch.tv/helix/users?login=${Username}`;
	const headers = {
		'Client-ID': CLIENT_ID, 
		'Authorization': `Bearer ${oAuth}`,
	};
	const response = await axios.get(user_info_url, { headers }).then(response => {
		const userData = response.data.data[0];
		console.log(userData);
		userID = userData['id'].toString();
		}).catch(error => {
		console.error('Error retrieving user information:', error);
	});
	return userID;
}

exports.getOriginChannelByEvent = function getOriginChannelByEvent (event) {
	if (event.data.includes(".tmi.twitch.tv JOIN")){
		return null;
	}
	const match = event.data.match(/:([^!]+)!/);
	if (match == null){
		console.log("match is null");
		return null;
	}
	return match['input'].split("#")[1].split(" :")[0];
}

// returns the username of the sender of a message
exports.getUsernameByEvent = getUsernameByEvent = (event) => {
	const usernameMatch = event.data.match(/:([^!]+)!/);
	const username = usernameMatch ? usernameMatch[1] : null;
	return username;
}

exports.getMessageContent = getMessageContent = (event) =>{
	console.log(event.data.match(/:([^!]+)!/));
	if (event.data.includes(".tmi.twitch.tv JOIN")){
		return null;
	}
	const match = event.data.match(/:([^!]+)!/);
	if (match == null){
		console.log("match is null");
		return null;
	}
	var list = event.data.match(/:([^!]+)!/)['input'].split(":");
	list.splice(0,2);
	list = list.join(":");
	list = list.split("\n")[0].split("\r")[0];
	return list;
}

exports.save = save = (data, file) =>{
	const finished = (error) => {
		if(error){
			console.error(error)
			return;
		}
	}
	const jsonData = JSON.stringify(data,null, 2)
	FileSystem.writeFile(file, jsonData, finished)
}
exports.getMessages = function getMessages(args, standartargs){
	for (var elem of standartargs.util_obj.list){
		if (elem.id == args.originChannelID){
			return elem.messages;
		}
	}
	return false;
}

exports.getMessageWithoutPrefix = getMessageWithoutPrefix = (message) =>{
	if (message.startsWith(Prefix)){
		return message.slice(Prefix.length);
	}
}

exports.saveChannel = async function saveChannel (channel, file, obj) {
	let list = Array.from(obj['list']);
	list.push(channel);
	obj["list"] = list;
	save(obj, file);
	return obj;
} 

exports.getChannelNamesOfJoinedChannels = async function getChannelNamesOfJoinedChannels (){
	const data = await FileSystem.promises.readFile('../data/util.json', (error, data) => {
		// if the reading process failed,
		// throwing the error
		if (error) {
		  // logging the error
		  console.error(error);
		  throw err;
		}
	})
	const obj = JSON.parse(data);
	let list = Array.from(obj['list']);
	let IDlist = new Array();
	for (let x=0;x<list.length;x++){	
		IDlist.push(list[x]['name']);
	}
	console.log(IDlist);
	return IDlist;
}

exports.saveIdea = async function saveIdea(idea, obj){
	let obje = obj['idea'];
	if (obje == null){
		console.log("NULL-ERROR");
		return null;
	}
	let list = Array.from(obje);
	list.push(idea);
	obj['idea'] = list;
	save(obj, '../data/util.json');
	return obj;
}

exports.automodActivated = async function automodActivated(originChannel){
	let data = await FileSystem.promises.readFile('../data/util.json', "binary");
	const obj = JSON.parse(data);
	let list = Array.from(obj['list']);
	for (var elem of list){
		if (elem.name == originChannel){
			return elem.automod;
		}
	}
	return false;
}

exports.setAutomod = async function setAutomod(channelID, bool, obj){
	let list = Array.from(obj['list']);
	for (var elem of list){
		if (elem.id == channelID){
			elem.automod = bool;
		}
	}
	obj['list'] = list;
	save(obj, '../data/util.json');
	return obj;
}
//TODO sendmsg function to remove duplicate lines

exports.followage = async function followage(data, args, standartargs, channel, user){
	data = await Promise.resolve(data).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(data);
	console.log(data['followedAt']);
	if (data['followedAt'] == null){
		standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is not following ${channel}.`)
	}
	else{
		let [date, time] = this.convertTime(data['followedAt']);
		let t = "am";
		if (time.split(":")[0]>12){
			time = time.split(":");
			time[0] = time[0]-12;
			t = "pm";
			time = time.join(":");
		}
		standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} started following ${channel} on ${date} at ${time} ${t}.`);
	}
}

exports.subage = async function subage(data, args, standartargs, channel, user){
	data = await Promise.resolve(data).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(data);
	console.log(data['followedAt']);
	if (data['streak'] == null){
		standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is not subcribed to ${channel}.`)
	}
	else{
		let streak = data['streak'];
		standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is subscribed to ${channel} with a Tier-${data.meta.tier} ${data.meta.type}-subscription for ${data.cumulative.months} months currently on a ${streak.months}-month streak ending/renewing in ${data.streak.daysRemaining} days.`);
	}
}

exports.getUsernameAndChannel = function getUsernameAndChannel(args){
	let mes = args.message.split(" ");
	// mes.length == 0 does not have to be covered, because the function would never be called
	if (mes.length == 1){
		user = args.usernameSender;
		channel = args.originChannel;
	}
	else if(mes.length == 2){
		user = mes[1];
		channel = args.originChannel;
	}
	else{
		user = mes[1];
		channel = mes[2];
	}
	return {
        user: user,
        channel: channel,
    }
}

exports.convertTime = function convertTime(time){
	let date = time.split("T")[0];
	time = time.split("T")[1];
	time = time.split("Z")[0];
	let dat = date.split("-").reverse().join(".");
	return [dat, time];
}
let mlenum = {
	AFFILIATE:1<<0,
	PARTNER:1<<1,
	STAFF:1<<2
}
exports.convertMlData = async function convertMlData(dat, args, standartargs){
	let datar = await Promise.resolve(dat).then(function(data) {return data;}).catch((error) => console.log(error));
	console.log(datar);
	console.log(datar);
	let [total, affiliate, partnered, allfollower] = [0,0,0,0];
	let user = datar.displayName;
	for (var elem of datar.moderating){
		total+=1;
		if (flags(mlenum.AFFILIATE, elem.flags)){
			affiliate+=1;
		}
		if (flags(mlenum.PARTNER, elem.flags)){
			partnered+=1;
		}
		allfollower+=elem.followers;
	}
	standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is mod in ${total} channels (Affiliate: ${affiliate}; Partnered: ${partnered}; Allfollower: ${allfollower}) https://mod.sc/${user}`)
}

function flags(flag, flags){
	return (flags & flag) === flag;
}

exports.notifyChannels = function notifyChannels(standartargs, id, user){
	let channels = standartargs.util_obj.subscribed[id];
	console.log(standartargs.util_obj.subscribed);
	console.log(channels);
	for (var elem of channels){
		standartargs.socket.send(`PRIVMSG #${elem} :${user} just went live DinkDonk`);
	}
}

exports.joinlivemsg = async function joinlivemsg(standartargs, id){
	await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
		body: JSON.stringify({"type": "stream.online","version": "1","condition": {"broadcaster_user_id": `${id}`},"transport": {"method": "websocket", "session_id": standartargs.eventid}}),
		headers: {
		  "Authorization": `Bearer ${oAuth}`,
		  "Client-Id": CLIENT_ID,
		  "Content-Type": "application/json"
		},
		method: "POST"
		}
		).then(data => data).catch(error => console.log(error));
}

exports.convertVlData = async function convertVlData(dat, args, standartargs){
	let datar = await Promise.resolve(dat).then(function(data) {return data;}).catch((error) => console.log(error));
	let [total, list] = [0, []];
	let user = datar.displayName;
	for (var elem of datar.viping){
		total+=1;
		list.push(elem.displayName);
	}
	let string = "";
	for (var elem of list){
		if (string == ""){
			string += elem;
		}else{
			string += ", " + elem;
		}
	}
	standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is VIP in ${total} channels: (${string}) https://mod.sc/${user}`)
}

exports.convertFlData = async function convertFlData(dat, args, standartargs){
	let datar = await Promise.resolve(dat).then(function(data) {return data;}).catch((error) => console.log(error));
	let [total, list] = [0, []];
	let user = datar.displayName;
	for (var elem of datar.founding){
		total+=1;
		list.push(elem.displayName);
	}
	let string = "";
	for (var elem of list){
		if (string == ""){
			string += elem;
		}else{
			string += ", " + elem;
		}
	}
	standartargs.socket.send(`PRIVMSG #${args.originChannel} :${user} is Founder in ${total} channels: (${string}) https://mod.sc/${user}`)
}

exports.getUsername = function getUsername(args){
	if (args.message.split(" ").length > 1){
		return args.message.split(" ")[1];
	}
	return args.usernameSender;
}

exports.getEmotename = function getEmotename(args){
	if (args.message.split(" ").length > 1){
		return args.message.split(" ")[1];
	}
	return null;
}

/**
 * Sends a message to the given Socket, returning true on success
 * - args: Struct containing eventinformation
 * - standartargs: Struct containing Botconfig
 * - message: Message to be sent
 * - OR
 * - args: Sending messages allowed in this Channel?
 * - standartargs: Channel where to send messages
 * - message: socket on which to send the message
 * - text: message
 * @typedef {{args:Boolean, standartargs:String, message:Websocket, text:String}}
 * @typedef {{args: Struct, standartargs: Structs, message: String}}
 */
exports.send = function send(args, standartargs, message, text){
	if(typeof message === typeof ""){
		if (args.messages){
			standartargs.socket.send(`PRIVMSG #${args.originChannel} :${message}`);
			return true;
		}
		return false;
	}
	else{
		if (args){
			message.send(`PRIVMSG #${standartargs} :${text}`);
			return true;
		}
		return false;
	}

}