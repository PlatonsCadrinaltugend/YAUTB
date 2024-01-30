exports.CLIENT_ID = CLIENT_ID = process.env.CLIENTID;
exports.oAuth = oAuth = process.env.TWITCHTOKEN;
const axios = require('axios');
const { enableCrossban } = require('./modactions');
exports.FileSystem = FileSystem = require('fs');
exports.Prefix = Prefix = "!";
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
	let list = Array.from(obj['idea']);
	list.push(idea);
	obj["idea"] = list;
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
