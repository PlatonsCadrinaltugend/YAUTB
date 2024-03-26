exports.execute = {
    name:"tempjoin",
    description:"Temporary adds this Bot to your channel.",
    usage:"tempjoin <channel>",
    Roles: ROLES.MODERATOR,
    code:(async function tempjoin(args, standartargs){
        const util = require('../src/util.js');
        if (args.message.split(" ").length == 2){
            let username = args.message.split(" ")[1];
            let id = await util.getUserIdByUserName(username).then(function(data) {return data;}).catch((error) => console.log(error));
            if (username) {
                for (elem of standartargs.util_obj['list']){
                    if (elem['id'] == id){
                        util.send(args, standartargs,'I already joined that Channel UNLUCKY')
                        return standartargs;
                    }
                }
                console.log(`Username: ${username}, User ID: ${id}`);
                util.send(args, standartargs,'I sucessfully joined that Channel ApuApproved');
                standartargs.socket.send(`JOIN #${username}`);
                console.log(`Joined ${username}`);
                }
        }

        return standartargs;
    })
}