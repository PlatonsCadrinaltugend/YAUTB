exports.execute = {
    name:"part",
    description:"Removes this Bot from your channel.",
    usage:"part",
    Roles: ROLES.USER,
    code:(async function part(args, standartargs){
        const util = require('../src/util.js');
        if (args.usernameSender) {
            let list = [];
            for (elem of standartargs.util_obj['list']){
                if (elem['id'] != args.idsender){
                    list.push(elem);
                }
            }
            standartargs.util_obj['list'] = list;
            util.send(args.messages, args.usernameSender, standartargs.socket, 'Goodbye :(');
            util.save(standartargs.util_obj, '../data/util.json');
            standartargs.socket.send(`PART #${args.usernameSender}`);
        }
        return standartargs;
    })
}