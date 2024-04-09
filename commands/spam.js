exports.execute = {
    name:"spam",
    description:"Sends the given message multiple times.",
    usage:"spam <amount> <message>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function spam(args, standartargs){
        const util = require('../src/util.js');
        let amount = args.message.split(" ")[1];
        if (amount > 100){
            return standartargs;
        }
        let message = args.message.split(" ");
        message.shift();
        message.shift();
        let mes2 = message.join(" ");
        for (x=0;x<amount;x++){
            util.send(args.messages, args.originChannel, standartargs.socket, mes2);
        }
        return standartargs;
    })
}