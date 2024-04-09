exports.execute = {
    name:"shutdown",
    description:"Shuts down the Bot. Restricted for Admins only.",
    usage:"shutdown",
    Roles: ROLES.ADMIN,
    code:(async function shutdown(args, standartargs){
        const util = require('../src/util.js');
        if (args.usernameSender == "deadcr1" && args.originChannel == "yautb"){
            standartargs.socket.close();
        }
        else{
            util.send(args.messages, args.originChannel, standartargs.socket, 'An Error occured, either you have insufficient privileges or this is not the right channel.');
        }
        return standartargs;
    })
}