exports.execute = {
    name:"swapMusikModifier",
    code:(function swapMusikModifier(args, standartargs){
        if (args.usernameSender == args.originChannel){
            standartargs.modify = !standartargs.modify;
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Set Modify-Musik to ${standartargs.modify}`)
        }
        return standartargs;
    })
}