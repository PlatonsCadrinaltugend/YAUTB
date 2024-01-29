exports.execute = {
    name:"shutdown",
    code:(async function shutdown(args, standartargs){
        const util = require('../src/util.js');
        if (args.usernameSender == "deadcr1" && args.originChannel == "yautb"){
            let channels = await (util.getChannelNamesOfJoinedChannels()).then(function(data) {return data;}).catch((error) => console.log(error));
            for (var channel of channels) {
                if (standartargs.Messages){
                    standartargs.socket.send(`PRIVMSG #${channel} :Deadge`);
                }
            }
            standartargs.socket.close();
        }
        else{
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :An Error occured, either you have insufficient privileges or this is not the right channel.`)
        }
        return standartargs;
    })
}