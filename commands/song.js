exports.execute = {
    name:"song",
    code:(function song(args, standartargs){
        const spotify = require('../src/spotify.js');
        spotify.getCurrentSong(standartargs.socket, args.originChannel);
        return standartargs;
    })
}