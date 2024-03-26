exports.execute = {
    name:"unban",
    description:"Unbans the given User. Admin only.",
    usage:"unban <user>",
    Roles: ROLES.MODERATOR,
    code:(async function unban(args, standartargs){
        const util = require('../src/util.js');
        const modactions = require('../src/modactions.js');

        let username = args.message.split(" ")[1];
        username = username.replace("@", "");
        let id = await util.getUserIdByUserName(username);
        await modactions.unbanUser(id, args.userIDIsOnWhitelist, args.originChannelID);
        return standartargs;
    })
}