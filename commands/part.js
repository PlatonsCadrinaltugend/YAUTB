exports.execute = {
    name:"part",
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
            standartargs.socket.send(`PRIVMSG #${args.usernameSender} :Goodbye :(`);
            util.save(standartargs.util_obj, '../data/util.json');
            standartargs.socket.send(`PART #${args.usernameSender}`);
        }
        return standartargs;
    })
}