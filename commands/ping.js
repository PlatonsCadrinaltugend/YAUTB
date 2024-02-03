exports.execute = {
    name:"ping",
    code:(async function ping(args, standartargs){
        standartargs.socket.send(`PRIVMSG #${args.originChannel} :PONG`)
        return standartargs;
    })
}