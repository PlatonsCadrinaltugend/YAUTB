exports.execute = {
    name:"play",
    code:(async function play(args, standartargs){
        const spotify = require('../src/spotify.js')
        await spotify.addSongToQueue(args.message, args.userIDIsOnWhitelist);
        return standartargs;
    })
}