exports.execute = {
    name:"todos",
    code:(async function todos(args, standartargs){
        const util = require('../src/util.js');

        if (args.usernameSender == "deadcr1"){
            if (args.message.split(" ").length == 1){
                let list = Array.from(standartargs.util_obj["idea"]);
                if (list.length>0){
                    for (var x=1; x<=list.length; x++){
                        standartargs.socket.send(`PRIVMSG #${args.originChannel} :${x}. ${list[x-1]}`)
                    }
                }
                else{
                    standartargs.socket.send(`PRIVMSG #${args.originChannel} :No TODOs found`)

                }
            }
            else if(args.message.split(" ").length>1){
                if(args.message.split(" ")[1] == "delete"){
                    let split = args.message.split(" ");
                    let list = [];
                    for (var x=2; x<split.length; x++){
                        list.push(split[x]);
                    }
                    console.log(list);
                    let newlist = [];
                    for (var y=standartargs.util_obj[`idea`].length-1; y>=0;y--){
                        if (!list.includes((y+1).toString())){
                            newlist.push(standartargs.util_obj[`idea`][(y)]);
                        }
                    }
                    standartargs.util_obj["idea"] = newlist.reverse();
                    util.save(standartargs.util_obj, '../data/util.json');
                }
            }

        }
        return standartargs;
    })
}