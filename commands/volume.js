exports.execute = {
    name:"volume",
    description:"Displays the current volume. Moderators can modify it.",
    usage:"volume <optional:percentage>",
    Roles: ROLES.USER,
    code:(function song(args, standartargs){
        if (args.originChannel != "deadcr1"){
            return standartargs;
        }
        const spotify = require('../src/spotify.js');
        if (standartargs.modify && args.message.split(" ").length == 2){
                spotify.setVolume(args.message.split(" ")[1], standartargs.socket, args.originChannel, args.userIDIsOnWhitelist);
        }
        else{
            spotify.getVolume(standartargs.socket, args.originChannel, args.userIDIsOnWhitelist);
        }
        return standartargs;
    })
}