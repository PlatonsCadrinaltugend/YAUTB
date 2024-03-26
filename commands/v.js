exports.execute = {
    name:"vanish",
    description:"Lets you vanish in a puff of smoke.",
    usage:"v",
    Roles: ROLES.USER,
    code: (async function execute(args, standartargs){
        const modactions = require('../src/modactions.js');
        console.log(args);
        await modactions.timeoutUser(args.idsender, args.usernameSender, args.usernameSender, true, 1, args.originChannelID);
        return standartargs;
    })
}