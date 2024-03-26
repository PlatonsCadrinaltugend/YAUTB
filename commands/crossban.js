exports.execute = {
    name:"crossban",
    description:"Advanced ban command to ban users from multiple channels at once. Restricted to Admins.",
    usage:"crossban <username>",
    Roles: ROLES.ADMIN,
    code:(async function crossban(args, standartargs){
        const util = require('../src/util.js');
        const modactions = require('../src/modactions.js');
        if (args.usernameSender == "deadcr1"){
            if (args.message.split(" ").length >= 2){
                let username = args.message.split(" ")[1];
                let message2 = args.message.split(" ");
                message2.shift();
                message2.shift();
                let reason = message2.join(" ");
                let id = await util.getUserIdByUserName(username);
                await modactions.crossban(id, username, args.idsender, args.originChannel, reason, standartargs.util_obj);
            }
            else{
                util.send(args, standartargs,'/me Usage: !crossban <user> <reason>');
            }
        }
        return standartargs;
    })
}