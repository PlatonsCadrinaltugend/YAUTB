exports.execute = {
    name:"disablecrossban",
    description:"Disables crossbans for your channel.",
    usage:"disablecrossban",
    Roles: ROLES.USER,
    code:(async function disablecrossban(args, standartargs){
        const modactions = require('../src/modactions.js');
        const util = require('../src/util.js')
        standartargs.util_obj = await modactions.enableCrossban(args.idsender, false, standartargs.util_obj);
        util.send(args.messages, args.originChannel, standartargs.socket,'/me Disabled crossbans for your channel ApuApproved');
        return standartargs;
    })
}