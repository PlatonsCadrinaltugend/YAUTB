const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFYREFRESHTOKEN;
const spotID = process.env.SPOTIFYCLIENTID
const spotSecret = process.env.SPOTIFYCLIENTSECRET;
var SpotAuth = null;
var whitelist = require('./whitelist.js');
const { stringify } = require('querystring');
const { parse, formatURI, formatOpenURL } = require('spotify-uri');
//TODO handle wrong inputs
//TODO handle right inputs the correct way
exports.addSongToQueue = async function addSongToQueue (message, userIDIsOnWhitelist) {
	if (userIDIsOnWhitelist){
		message = message.split(" ")[1];
        if ((message.startsWith("http://open.spotify.com/track/") && message.length == 52) ||message.startsWith("https://open.spotify.com/intl-de/track/")){
            await refreshToken();
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


exports.skipSong = async function skipSong(socket, originChannel, userID, originChannelID){
    let bool = await whitelist.userIDIsOnWhitelist(userID, originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
	if (bool){
        await refreshToken();
        fetch("https://api.spotify.com/v1/me/player/next", {
            headers: {
            Authorization: `Bearer ${SpotAuth}`
            },
            method: "POST"
        }).then(socket.send(`PRIVMSG #${originChannel} :Sucessfully skipped current Song ApuApproved`)).catch((error) => {console.log(error), socket.send(`PRIVMSG #${originChannel} :There was an Error skipping the current Song.`)});
    }
    else {
        socket.send(`PRIVMSG #${originChannel} :You seem to be missing permission to use this command. Ask the broadcaster to permit you to use this command.`)
    }
}

exports.setVolume = async function setVolume(volume, socket, originChannel, userIDIsOnWhitelist){
    if (userIDIsOnWhitelist){
        await refreshToken();
        fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
        headers: {
        Authorization: `Bearer ${SpotAuth}`
        },
        method: "PUT"
    }).then(socket.send(`PRIVMSG #${originChannel} :Sucessfully set Volume to ${volume} ApuApproved`)).catch(error => console.log(error));
    }
}

exports.getVolume = async function getVolume(socket, originChannel, userIDIsOnWhitelist){
	if (userIDIsOnWhitelist){
        await refreshToken();
    fetch("https://api.spotify.com/v1/me/player", {
    headers: {
        Authorization: `Bearer ${SpotAuth}`
    }
    }).then(response=>response.json()).then(data => {console.log(data); socket.send(`PRIVMSG #${originChannel} :Current Volume: ${data["device"]["volume_percent"]}`)}).catch(error => console.log(error));
    }
}