const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFYREFRESHTOKEN;
const spotID = process.env.SPOTIFYCLIENTID
const spotSecret = process.env.SPOTIFYCLIENTSECRET;
var SpotAuth = null;
var whitelist = require('./whitelist.js');
const { stringify } = require('querystring');
const { parse, formatURI, formatOpenURL } = require('spotify-uri');

exports.addSongToQueue = async function addSongToQueue (userID, message) {
	let bool = await whitelist.userIDIsOnWhitelist(userID).then(function(data) {return data;}).catch((error) => console.log(error));
	if (bool){
        await refreshToken();
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
		}).then(console.log("Queued sucessfully")).catch(error => console.error(error));
	}
}

async function refreshToken(){
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
        console.log("Sucessfully refreshed Token")}).catch(error => console.error(error));
}


exports.getCurrentSong = async function getCurrentSong (socket, originChannel){
    await refreshToken();
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
            Authorization: `Bearer ${SpotAuth}`
        }
    }).then(response => response.json()).then((data) => {let artists = data["item"]["artists"]; socket.send(`PRIVMSG #${originChannel} :Currently playing "${data["item"]["name"]}" by ${artists[0].name}. ${formatOpenURL(parse(data["item"]["uri"]))}`);}).catch((error)=>{console.log(error); socket.send(`PRIVMSG #${originChannel} :There was an Error while trying to retrieve Songinformation UNLUCKY`)})}