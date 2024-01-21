var util = require('./Util.js');
const FileSystem = util.FileSystem;
exports.fs = fs = require('fs').promises;

exports.saveWhitelist = saveWhitelist = (userID, originChannel, username, remove, socket) =>{
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
	  });
}

exports.userIDIsOnWhitelist = async function userIDIsOnWhitelist (id) {
	let data = await fs.readFile('Whitelist.json', "binary");
	const obj = JSON.parse(data);
	let list = Array.from(obj['list']);
	return list.includes(id);
}