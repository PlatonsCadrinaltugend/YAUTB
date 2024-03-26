exports.execute = {
    name:"setrole",
    description:"Gives the User Permissions for this Bot",
    usage:"setrole <Role> <user>",
    Roles: ROLES.ADMIN,
    code:(async function setrole(args, standartargs){
        const util = require('../src/util.js');
        let userID = await util.getUserIdByUserName(args.message.split(" ")[2]);
        userID = await Promise.resolve(userID).then(function(data) {return data;}).catch((error) => console.log(error));;
        let role = args.message.split(" ")[1];
        standartargs.whitelist_obj['global'][userID] = "ROLES." + role;
        util.save(standartargs.whitelist_obj,'../data/whitelist.json');
        return standartargs;
    })
}