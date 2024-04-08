const FileSystem = require('fs');
exports.fs = fs = require('fs').promises;

exports.saveWhitelist = saveWhitelist = (userID, originChannel, username, remove, socket, channelid, user) =>{
		let list = [];
		// parsing the JSON object
		// to convert it to a JavaScript object
		if (user){
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
	}

exports.userAccess = async function userAccess(args, standartargs, id) {
	const obj = standartargs.whitelist_obj;
	if (obj['global'][id] == "ROLES.MODERATOR"){
		return ROLES.MODERATOR;
	}
	if (obj['global'][id] == "ROLES.ADMIN"){
		return ROLES.ADMIN;
	}
	if (obj['local'][args.originChannelID]){
		if (obj['local'][args.originChannelID][id]){
			if (obj['local'][args.originChannelID][id] == "ROLES.CHANNEL_MODERATOR"){
				return ROLES.CHANNEL_MODERATOR;
			}
		}
	}
	return ROLES.USER;
}

//TODO split whitelist into musiccontroller and modactionscontroller