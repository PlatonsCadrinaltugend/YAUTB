exports.execute = {
    name:"suggest",
    description:"Lets you suggest ideas which could be implemented in the future.",
    usage:"suggest <idea>",
    Roles: ROLES.USER,
    code:(function suggest(args, standartargs){
        console.log(standartargs);
        const util = require('../src/util.js')
        let list = args.message.split(" ");
        list.splice(0,1);
        list = list.join(" ");
        if (list && list != null){
            let obj = util.saveIdea(list, standartargs.util_obj);
            if (obj != null){
                standartargs.util_obj = obj;
            }
            util.send(args.messages, args.originChannel, standartargs.socket, 'Saving your suggestion. Thank you for your help improving this bot luvv');
        }else{
            util.send(args.messages, args.originChannel, standartargs.socket, `/me Usage: ${util.Prefix}suggest <suggestion>`);
        }
        return standartargs;
    })
}