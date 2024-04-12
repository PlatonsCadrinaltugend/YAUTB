exports.execute = {
    name:"ban",
    description:"Users with sufficient Privileges can use this command to ban someone from a channel.",
    usage:"ban <username>",
    Roles: ROLES.MODERATOR,
    code:(async function ban(args, standartargs){
        const util = require('../src/util.js');
        const whitelist = require('../src/whitelist.js');

        const modactions = require('../src/modactions.js');
        let username = args.message.split(" ")[1];
        username = username.replace("@", "");
        let id = await util.getUserIdByUserName(username);
        let access = await Promise.resolve(await whitelist.userAccess(standartargs, id)).then(function(data){return data;});
        console.log("------------------------------------ ---------------------------------")
        console.log(access);
        console.log("------------------------------------ ---------------------------------")
        if (access != ROLES.ADMIN){
            await modactions.banUser(id, username, `Automated Ban By YAUTB. Authorized by ${args.usernameSender}`, args.userIDIsOnWhitelist, args.originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
        }
        return standartargs;
    })
}