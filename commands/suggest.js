exports.execute = {
    name:"suggest",
    code:(function suggest(args, standartargs){
        const util = require('../src/util.js')
        let list = args.message.split(" ");
        list.splice(0,1);
        list = list.join(" ");
        if (list && list != null){
            standartargs.util_obj = util.saveIdea(list, standartargs.util_obj);
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :Saving your suggestion. Thank you for your help improving this bot luvv`);
        }else{
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Usage: !suggest <suggestion>`);
        }
        return standartargs;
    })
}