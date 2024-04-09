exports.execute = {
    name:"followage",
    description:"Checks for how long an user is following a specific channel.",
    usage:"followage <optional:user> <optional:channel>",
    Roles: ROLES.USER,
    code:(async function followage(args, standartargs){
        const util = require('../src/util.js');
        let struct = util.getUsernameAndChannel(args);
        let user = struct.user;
        let channel = struct.channel;
        user = user.replace("@", "");
        channel = channel.replace("@", "");
        console.log(user, channel);
        if (channel == user){
            util.send(args.messages, args.originChannel, standartargs.socket,'You cannot follow yourself.');
            return standartargs;
        }
        let response = await fetch(`https://api.ivr.fi/v2/twitch/subage/${user}/${channel}`).then((data) => util.followage(data.json(), args, standartargs, channel, user)).then().catch((error)=>{console.log(error);});
        return standartargs;
    })
}
