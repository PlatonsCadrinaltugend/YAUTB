exports.execute = {
    name:"enableAutomod",
    description:"Enables Automod for your channel.",
    usage:"enableAutomod",
    Roles: ROLES.USER,
    code:(async function enableAutomod(args, standartargs){
        const util = require('../src/util.js')
        standartargs.util_obj = await util.setAutomod(args.idsender, true, standartargs.util_obj);
        util.send(args, standartargs,'/me Enabled automod for your channel ApuApproved');
        return standartargs;
    })
}