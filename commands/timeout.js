exports.execute = {
    name:"timeout",
    description:"Timeouts a specific user. Admin only.",
    usage:"timeout <user> <time in seconds>",
    Roles: ROLES.MODERATOR,
    code:(async function timeout(args, standartargs){
        const util = require('../src/util.js')
        const modactions = require('../src/modactions.js');
        const whitelist = require('../src/whitelist.js');

        let username = args.message.split(" ")[1];
        username = username.replace("@", "");
        let time = args.message.split(" ")[2];
        let id = await util.getUserIdByUserName(username);
        let access = await whitelist.userAccess(standartargs, id)
        console.log(access);
        if (access != ROLES.ADMIN){
            await modactions.timeoutUser(id, username, args.usernameSender, args.userIDIsOnWhitelist, time, args.originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
        }
        return standartargs;
    })
}