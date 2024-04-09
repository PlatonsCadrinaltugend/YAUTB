exports.execute = {
    name:"swapMusikModifier",
    description:"Enables/Disables the possibility to modify music.",
    usage:"swapMusikModifier",
    Roles: ROLES.ADMIN,
    code:(function swapMusikModifier(args, standartargs){
        if (args.originChannel != "deadcr1"){
            return standartargs;
        }
        if (args.usernameSender == args.originChannel){
            standartargs.modify = !standartargs.modify;
           utils.send(args.messages, args.originChannel, standartargs.socket,`/me Set Modify-Musik to ${standartargs.modify}`)
        }
        return standartargs;
    })
}