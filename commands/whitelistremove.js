exports.execute = {
    name:"whitelistremove",
    code:(async function whitelistremove(args, standartargs){
        const util = require('../src/util.js');
        const whitelist = require('../src/whitelist.js');
		if (args.message != null && (args.usernameSender == args.originChannel || args.usernameSender =="deadcr1")){
            let username = args.message.split(" ")[1];
            username = username.replace("@", "");
            if (username) {
                let userId = await util.getUserIdByUserName(username).then(function(data) {return data;}).catch((error) => console.log(error));
                standartargs.whitelist_obj = whitelist.saveWhitelist(userId, args.originChannel, username, true, standartargs.socket, args.originChannelID, standartargs.whitelist_obj);
            }}
        return standartargs;
    })
}