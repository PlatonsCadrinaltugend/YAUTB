exports.execute = {
    name:"join",
    description:"Adds this Bot to your channel.",
    usage:"join",
    Roles: ROLES.USER,
    code:(async function join(args, standartargs){
        const util = require('../src/util.js');

        if (args.usernameSender) {
            for (elem of standartargs.util_obj['list']){
                if (elem['id'] == args.idsender){
                    util.send(args, standartargs,'I already joined your Channel UNLUCKY');
                    return standartargs;
                }
            }
            userId = await util.getUserIdByUserName(args.usernameSender).then(function(data) {return data;}).catch((error) => console.log(error));
                var channel = {
                    "name": args.usernameSender,
                    "id": userId,
                    "crossban":true,
                    "automod":true,
                    "bible":[],
                    "messages":true
                }
                console.log(`Username: ${args.usernameSender}, User ID: ${userId}`);
                util.send(args.messages, args.usernameSender, standartargs.socket, 'Hello there :D');
                util.send(args, standartargs, 'I sucessfully joined your Channel ApuApproved');
                standartargs.util_obj = await util.saveChannel(channel, '../data/util.json', standartargs.util_obj);
                standartargs.socket.send(`JOIN #${args.usernameSender}`);
                console.log(`Joined ${args.usernameSender}`);
            }
        return standartargs;
    })
}