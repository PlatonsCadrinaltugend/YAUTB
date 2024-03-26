exports.execute = {
    name:"song",
    description:"Returns the currently playing song.",
    usage:"song",
    Roles: ROLES.USER,
    code:(function song(args, standartargs){
        if (args.originChannel != "deadcr1"){
            return standartargs;
        }
        const spotify = require('../src/spotify.js');
        spotify.getCurrentSong(standartargs.socket, args.originChannel);
        return standartargs;
    })
}