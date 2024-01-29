exports.execute = {
    name:"enableAutomod",
    code:(async function enableAutomod(args, standartargs){
        const util = require('../src/util.js')
        standartargs.util_obj = await util.setAutomod(args.idsender, true, standartargs.util_obj);
        standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Enabled automod for your channel ApuApproved`)
        return standartargs;
    })
}