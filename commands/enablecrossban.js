exports.execute = {
    name:"enablecrossban",
    description:"Enables crossban for your channel.",
    usage:"enablecrossban",
    Roles: ROLES.USER,
    code:(async function enablecrossban(args, standartargs){
        const modactions = require('../src/modactions.js');
        const util = require('../src/util.js');
        standartargs.util_obj = await modactions.enableCrossban(args.idsender, true, standartargs.util_obj);
        util.send(args, standartargs,'/me Enabled crossbans for your channel ApuApproved');
        return standartargs;
    })
}