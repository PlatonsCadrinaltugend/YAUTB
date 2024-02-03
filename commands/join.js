exports.execute = {
    name:"join",
    code:(async function join(args, standartargs){
        const util = require('../src/util.js');

        if (args.usernameSender) {
            for (elem of standartargs.util_obj['list']){
                if (elem['id'] == args.idsender){
                    standartargs.socket.send(`PRIVMSG #${args.originChannel} :I already joined your Channel UNLUCKY`)
                    return standartargs;
                }
            }
            userId = await util.getUserIdByUserName(args.usernameSender).then(function(data) {return data;}).catch((error) => console.log(error));
                var channel = {
                    "name": args.usernameSender,
                    "id": userId,
                    "crossban":true,
                    "automod":true
                }
                console.log(`Username: ${args.usernameSender}, User ID: ${userId}`);
                standartargs.socket.send(`PRIVMSG #${args.usernameSender} :Hello there :D`);
                standartargs.socket.send(`PRIVMSG #${args.originChannel} :I sucessfully joined your Channel ApuApproved`);
                standartargs.util_obj = await util.saveChannel(channel, '../data/util.json', standartargs.util_obj);
                standartargs.socket.send(`JOIN #${args.usernameSender}`);
                console.log(`Joined ${args.usernameSender}`);
            }
        return standartargs;
    })
}