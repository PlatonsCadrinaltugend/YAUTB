exports.execute = {
    name:"bible",
    code:(async function bible(args, standartargs){
        const util = require('../src/util.js');
        if (args.message.split(" ").length <=1){
            for (var elem of standartargs.util_obj.list){
                if (elem.id == args.originChannelID){
                    let list = Array.from(elem.bible);
                    let quote = list[Math.floor(Math.random()*list.length)];
                    if (quote == undefined){
                        standartargs.socket.send(`PRIVMSG #${args.originChannel} :Bible is empty`)
                    }else{
                        standartargs.socket.send(`PRIVMSG #${args.originChannel} :${quote}`)
                    }
                }
            }
        }
        else{
            let mes = args.message.split(" ");
            let username = mes[mes.length-1];
            mes.splice(0,1);
            mes.splice(mes.length-1,mes.length);
            let quote = mes.join(" ");
            for (var elem of standartargs.util_obj.list){
                if (elem.id == args.originChannelID && args.userIDIsOnWhitelist){
                    let list = Array.from(elem.bible);
                    console.log(list);
                    list.push(quote + " ~ " + username);
                    console.log(list);
                    elem.bible = list;
                    util.save(standartargs.util_obj, '../data/util.json');
                }
            }
            }

        return standartargs;
    })
}