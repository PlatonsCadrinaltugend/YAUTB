exports.execute = {
    name:"swapMusikModifier",
    code:(function song(args, standartargs){
        //returns current volume if input length > 1 while modifier is false
        if (args.usernameSender == args.originChannel){
            standartargs.modify = !standartargs.modify;
            standartargs.socket.send(`PRIVMSG #${args.originChannel} :/me Set Modify-Musik to ${standartargs.modify}`)
        }
        return standartargs;
    })
}