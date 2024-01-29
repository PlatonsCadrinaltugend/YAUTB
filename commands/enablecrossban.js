exports.execute = {
    name:"enablecrossban",
    code:(async function enablecrossban(args, standartargs){
        const modactions = require('../src/modactions.js');

        standartargs.util_obj = await modactions.enableCrossban(args.idsender, true, standartargs.util_obj);
        standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Enabled crossbans for your channel ApuApproved`)
        return standartargs;
    })
}