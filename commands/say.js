exports.execute = {
    name:"say",
    description:"Sends a given message in a specified channel.",
    usage:"say <channel> <message>",
    Roles: ROLES.ADMIN,
    code:(async function say(args, standartargs){
        const util = require('../src/util.js');
        if (args.usernameSender == "deadcr1"){
            let channel = args.message.split(" ")[1];
            let mes = args.message.split(" ");
            mes.splice(0,2);
            mes = mes.join(" ");
            let bool = false;
            let id = util.getUserIdByUserName(channel);
            if (channel == "--global"){
                for (var elem of standartargs.util_obj.list){
                    util.send(true, elem['name'], standartargs.socket, mes);
                }
            }else{
                for (var elem of standartargs.util_obj.list){
                    if (elem['id'] == id){
                        bool = true;
                    } 
                }
                if (bool){
                    standartargs.socket.send(`JOIN #${channel}`);
                    console.log(`Joined ${channel}`);
                    util.send(true, channel, standartargs.socket, mes);
                    standartargs.socket.send(`PART #${channel}`);
                }
                else{
                    util.send(true, channel, standartargs.socket, mes);                }
            }

        }
        
        return standartargs;
    })
}