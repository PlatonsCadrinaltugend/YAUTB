exports.execute = {
    name:"skip",
    code:(function song(args, standartargs){
        const spotify = require('../src/spotify.js');
        if (standartargs.modify){
            spotify.skipSong(standartargs.socket, args.originChannel, args.idsender, args.originChannelID);
        }
        return standartargs;
    })
}