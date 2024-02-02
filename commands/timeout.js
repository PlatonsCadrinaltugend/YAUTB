exports.execute = {
    name:"timeout",
    code:(async function timeout(args, standartargs){
        const util = require('../src/util.js')
        const modactions = require('../src/modactions.js');

        let username = args.message.split(" ")[1];
        username = username.replace("@", "");
        let time = args.message.split(" ")[2];
        let id = await util.getUserIdByUserName(username);
        await modactions.timeoutUser(id, username, args.usernameSender, args.userIDIsOnWhitelist, time, args.originChannelID).then(function(data) {return data;}).catch((error) => console.log(error));
        return standartargs;
    })
}