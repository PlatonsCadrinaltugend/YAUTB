const oAuth = "af2bya2gwdunc4hyzqt267q5mdn7j5";
const nick = `njdagdoiad`;
const channels = ["deadcr1", "yautb"];
const Messages = false;

const axios = require('axios');
const FileSystem = require('fs');
Object.assign(global, { WebSocket: require('ws') });

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


socket.addEventListener('message', event => {
	if (socket.readyState === WebSocket.OPEN) {
		var message;
		var originChannel;
		var username;
		if (!event.data.includes(":tmi.twitch.tv")){
			const username = getUsernameByEvent(event);
			const originChannel = getOriginChannelByEvent(event);
			message = getMessageContent(event);
			console.log(`Message: ${message}.`);
		
		switch(message){
			case "kok ppPoof": {	
				if (username == "deadcr1" && originChannel == "yautb"){
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
				if (username) {
					const user_info_url = `https://api.twitch.tv/helix/users?login=${username}`;
					const headers = {
						'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5', 
						'Authorization': `Bearer ${oAuth}`,
					};
	
					const response = axios.get(user_info_url, { headers }).then(response => {
						const userData = response.data.data[0];
						const userId = userData.id;
						var channel = {
							"name": username,
							"id": userId,
						}
						console.log(`Username: ${username}, User ID: ${userId}`);
						saveChannels(channel, 'channels.json');
					})
					.catch(error => {
						console.error('Error retrieving user information:', error);
					});
				
				}
			}
			default: break;
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

async function playSongBySpotifylink(link){
	//TODO
}

function getCurrentSong(){
	
}

const saveChannels = (channel, file) =>{
	const finished = (error) => {
		if(error){
			console.error(error)
			return;
		}
	}
	const jsonData = JSON.stringify(channel,null, 2)
	FileSystem.appendFile(file, jsonData, finished)
}

// returns the username of the sender of a message
getUsernameByEvent = (event) => {
	const usernameMatch = event.data.match(/:([^!]+)!/);
	const username = usernameMatch ? usernameMatch[1] : null;
	return username;
}

getMessageContent = (event) =>{
	console.log(event.data.match(/:([^!]+)!/));
	if (event.data.includes(".tmi.twitch.tv JOIN")){
		return null;
	}
	return event.data.match(/:([^!]+)!/)['input'].split(":")[2].split("\n")[0].split("\r")[0];
}

getOriginChannelByEvent = (event) => {
	return event.data.match(/:([^!]+)!/)['input'].split("#")[1].split(" :")[0];
}

// TODO sometimes there is an error when starting the bot, figure out why it is there and remove it