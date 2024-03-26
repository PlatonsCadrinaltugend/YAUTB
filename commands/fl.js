exports.execute = {
    name:"founderlookup",
    description:"Shows the Founding-stats of an user",
    usage:"fl <optional:username>",
    Roles: ROLES.USER,
    code:(async function founderlookup(args, standartargs){
        const util = require('../src/util.js')
        let username = util.getUsername(args);
        let fl = await fetch(`https://api.modscanner.com/twitch/user/${username}`).then(data => data.json());
        util.convertFlData(fl, args, standartargs);
        return standartargs;
    })
}