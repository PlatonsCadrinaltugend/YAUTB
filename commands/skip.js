exports.execute = {
    name:"skip",
    description:"Skips the current song. Moderators only.",
    usage:"skip",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(function song(args, standartargs){
        if (args.originChannel != "deadcr1"){
            return standartargs;
        }
        const spotify = require('../src/spotify.js');
        if (standartargs.modify){
            spotify.skipSong(standartargs.socket, args.originChannel, args.idsender, args.originChannelID);
        }
        return standartargs;
    })
}