exports.execute = {
    name:"modlookup",
    description:"Shows the Moderatingstats of an user",
    usage:"ml <optional:username>",
    Roles: ROLES.USER,
    code:(async function modlookup(args, standartargs){
        const util = require('../src/util.js')
        let username =  util.getUsername(args);
        let ml = await fetch(`https://api.modscanner.com/twitch/user/${username}`).then(data => data.json());
        util.convertMlData(ml, args, standartargs);
        return standartargs;
    })
}