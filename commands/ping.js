exports.execute = {
    name:"ping",
    description:"PONG",
    usage:"ping",
    Roles: ROLES.USER,
    code:(async function ping(args, standartargs){
        const util = require('../src/util.js')
        util.send(args.messages, args.originChannel, standartargs.socket, 'PONG')
        return standartargs;
    })
}