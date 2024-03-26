exports.execute = {
    name:"disableAutomod",
    description:"Disables Automod for your channel.",
    usage:"disableAutomod",
    Roles: ROLES.USER,
    code:(async function disableAutomod(args, standartargs){
        const util = require('../src/util.js')
        standartargs.util_obj = await util.setAutomod(args.idsender, false, standartargs.util_obj);
        util.send(args, standartargs,'/me Disabled automod for your channel ApuApproved');
        return standartargs;
    })
}