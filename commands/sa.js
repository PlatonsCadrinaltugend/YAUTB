exports.execute = {
    name:"subage",
    description:"Checks for how long an user is subscribed to a specific channel.",
    usage:"sa <optional:user> <optional:channel>",
    Roles: ROLES.USER,
    code:(async function subage(args, standartargs){
        const util = require('../src/util.js');
        let struct = util.getUsernameAndChannel(args);
        let user = struct.user;
        let channel = struct.channel;
        user = user.replace("@", "");
        channel = channel.replace("@", "");
        console.log(user, channel);
        let response = await fetch(`https://api.ivr.fi/v2/twitch/subage/${user}/${channel}`).then((data) => util.subage(data.json(), args, standartargs, channel, user)).then().catch((error)=>{console.log(error);});
        return standartargs;
    })
}
