exports.execute = {
    name:"say",
    code:(async function say(args, standartargs){
        const util = require('../src/util.js');
        if (args.usernameSender == "deadcr1"){
            let channel = args.message.split(" ")[1];
            let mes = args.message.split(" ");
            mes.splice(0,2);
            mes = mes.join(" ");
            let bool = false;
            let id = util.getUserIdByUserName(channel);
            for (var elem of standartargs.util_obj.list){
                if (elem['id'] == id){
                    bool = true;
                } 
            }
            if (bool){
                standartargs.socket.send(`JOIN #${channel}`);
                console.log(`Joined ${channel}`);
                standartargs.socket.send(`PRIVMSG #${channel} :${mes}`);
                standartargs.socket.send(`PART #${channel}`);
            }
            else{
                standartargs.socket.send(`PRIVMSG #${channel} :${mes}`);
            }
        }
        
        return standartargs;
    })
}