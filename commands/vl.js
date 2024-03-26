exports.execute = {
    name:"viplookup",
    description:"Shows the VIP-stats of an user",
    usage:"vl <optional:username>",
    Roles: ROLES.USER,
    code:(async function viplookup(args, standartargs){
        const util = require('../src/util.js')
        let username =  util.getUsername(args);
        let vl = await fetch(`https://api.modscanner.com/twitch/user/${username}`).then(data => data.json());
        util.convertVlData(vl, args, standartargs);
        return standartargs;
    })
}