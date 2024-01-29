exports.execute = {
    name:"disablecrossban",
    code:(async function disablecrossban(args, standartargs){
        const modactions = require('../src/modactions.js');

        standartargs.util_obj = await modactions.enableCrossban(args.idsender, false, standartargs.util_obj);
        standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Disabled crossbans for your channel ApuApproved`)
        return standartargs;
    })
}