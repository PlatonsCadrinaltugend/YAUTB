exports.execute = {
    name:"song",
    code:(function song(args, standartargs){
        const spotify = require('../src/spotify.js');
        if (standartargs.modify){
            spotify.getCurrentSong(standartargs.socket, args.originChannel);
        }
        return standartargs;
    })
}