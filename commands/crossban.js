exports.execute = {
    name:"crossban",
    code:(async function crossban(args, standartargs){
        const util = require('../src/util.js');
        const modactions = require('../src/modactions.js');
        if (args.usernameSender == "deadcr1"){
            if (args.message.split(" ").length >= 2){
                let username = args.message.split(" ")[1];
                let message2 = args.message.split(" ");
                message2.shift();
                message2.shift();
                let reason = message2.join(" ");
                let id = await util.getUserIdByUserName(username);
                await modactions.crossban(id, username, args.idsender, args.originChannel, reason, standartargs.whitelist_obj);
            }
            else{
                standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Usage: !crossban <user> <reason>`)
            }
        }
        return standartargs;
    })
}