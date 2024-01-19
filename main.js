require('dotenv').config(); 
const oAuth = process.env.TWITCHTOKEN;
const nick = `njdagdoiad`;
const channels = ["deadcr1", "yautb"];
const Messages = false;
const spotID = process.env.SPOTIFYCLIENTID
const spotSecret = process.env.SPOTIFYCLIENTSECRET;
var SpotAuth = null;
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
		if (!event.data.includes(":tmi.twitch.tv")){
			const usernameSender = getUsernameByEvent(event);
			const originChannel = getOriginChannelByEvent(event);
			const message = getMessageContent(event);
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
				socket.send(`PRIVMSG #${originChannel} :kok`);
				break;
			}
			case "kok add kok": {
				if (usernameSender) {
					const user_info_url = `https://api.twitch.tv/helix/users?login=${usernameSender}`;
					const headers = {
						'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5', 
						'Authorization': `Bearer ${oAuth}`,
					};
	
					const response = axios.get(user_info_url, { headers }).then(response => {
						const userData = response.data.data[0];
						const userId = userData.id;
						var channel = {
							"name": usernameSender,
							"id": userId,
						}
						console.log(`Username: ${usernameSender}, User ID: ${userId}`);
						save(channel, 'channels.json');
					})
					.catch(error => {
						console.error('Error retrieving user information:', error);
					});
				
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
						const user_info_url = `https://api.twitch.tv/helix/users?login=${username}`;
						const headers = {
							'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5', 
							'Authorization': `Bearer ${oAuth}`,
						};
		
						const response = axios.get(user_info_url, { headers }).then(response => {
							const userData = response.data.data[0];
							const userId = userData.id;
							saveWhitelist(userId, originChannel, username, remove);
						})
						.catch(error => {
							console.error('Error retrieving user information:', error);
						});
					}
			}
		}
		if (message != null && message.startsWith("kok play")){
			fetch("https://accounts.spotify.com/api/token", {
  				body: `grant_type=client_credentials&client_id=${spotID}&client_secret=${spotSecret}`,
  				headers: {
    				"Content-Type": "application/x-www-form-urlencoded"
 				},
  				method: "POST"
			}).then(response => response.json())
			.then(data => {
				SpotAuth = data.access_token;
				console.log(SpotAuth);
			})
			.catch(error => console.error(error));

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

const save = (data, file) =>{
	const finished = (error) => {
		if(error){
			console.error(error)
			return;
		}
	}
	const jsonData = JSON.stringify(data,null, 2)
	FileSystem.writeFile(file, jsonData, finished)
}

const saveWhitelist = (userID, originChannel, username, remove) =>{
	FileSystem.readFile('Whitelist.json', (error, data) => {
		// if the reading process failed,
		// throwing the error
		if (error) {
		  // logging the error
		  console.error(error);
	  
		  throw err;
		}
	  
		// parsing the JSON object
		// to convert it to a JavaScript object
		const user = JSON.parse(data);
	  	var list = Array.from(user['list']);
		if(!list.includes(userID) && remove == false){
			list.push(`${userID}`);
			socket.send(`PRIVMSG #${originChannel} :${username} has been whitelisted HYPERS`);
		}else if(!list.includes(userID)){
			socket.send(`PRIVMSG #${originChannel} :${username} is not whitelisted Saved`);
		}else if(remove == true){
			const index = list.indexOf(userID);
			list.splice(index, 1);
			socket.send(`PRIVMSG #${originChannel} :${username} has been removed from the whitelist Sadge`);
		}
		else{
			console.log("Already Whitelisted");
			socket.send(`PRIVMSG #${originChannel} :${username} is already whitelisted UNLUCKY`);
		}
		user['list'] = list;
		save(user, 'Whitelist.json');
		// printing the JavaScript object
		// retrieved from the JSON file
	  });

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
	const match = event.data.match(/:([^!]+)!/);
	if (match == null){
		console.log("match is null");
		return null;
	}
	return match['input'].split(":")[2].split("\n")[0].split("\r")[0];
}

getOriginChannelByEvent = (event) => {
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

// TODO sometimes there is an error when starting the bot, figure out why it is there and remove it