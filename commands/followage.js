exports.execute = {
    name:"followage",
    code:(async function followage(args, standartargs){
        const util = require('../src/util.js');
        let struct = util.getUsernameAndChannel(args);
        let user = struct.user;
        let channel = struct.channel;
        console.log(user, channel);
        if (channel == user){
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :You cannot follow yourself.`);
            return standartargs;
        }
        let response = await fetch(`https://api.ivr.fi/v2/twitch/subage/${user}/${channel}`).then((data) => util.followage(data.json(), args, standartargs, channel, user)).then().catch((error)=>{console.log(error);});
        return standartargs;
    })
}
