exports.execute = {
    name:"disableAutomod",
    code:(async function disableAutomod(args, standartargs){
        const util = require('../src/util.js')
        standartargs.util_obj = await util.setAutomod(args.idsender, false, standartargs.util_obj);
        standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Disabled automod for your channel ApuApproved`)
        return standartargs;
    })
}