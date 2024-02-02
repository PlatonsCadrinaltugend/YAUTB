const FileSystem = require('fs');
exports.fs = fs = require('fs').promises;

exports.saveWhitelist = saveWhitelist = (userID, originChannel, username, remove, socket, channelid, user) =>{
		let list = [];
		// parsing the JSON object
		// to convert it to a JavaScript object
		if (user.hasOwnProperty(channelid)){
			list = Array.from(user[channelid]);
		}
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
		user[channelid] = list;
		save(user, '../data/Whitelist.json');
		return user;
	  }

exports.userIDIsOnWhitelist = async function userIDIsOnWhitelist (id, channelid) {
	let data = await fs.readFile('../data/Whitelist.json', "binary");
	const obj = JSON.parse(data);
	if (obj.hasOwnProperty(channelid)){
		let list = Array.from(obj[channelid]);
		console.log(list);
		return list.includes(id);
	}
	return false;
}

//TODO split whitelist into musiccontroller and modactionscontroller