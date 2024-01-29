exports.execute = {
    name:"ban",
    code:(async function ban(args, standartargs){
        const util = require('../src/util.js');
        const modactions = require('../src/modactions.js');

        let username = args.message.split(" ")[1];
        username = username.replace("@", "");
        let id = await util.getUserIdByUserName(username);
        await modactions.banUser(id, username, `Automated Ban By YAUTB. Authorized by ${args.usernameSender}`, args.userIDIsOnWhitelist, args.originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
        return standartargs;
    })
}