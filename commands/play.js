exports.execute = {
    name:"play",
    description:"Plays the given song on Spotify.",
    usage:"play <Spotifylink of your Song>",
    Roles: ROLES.MODERATOR,
    code:(async function play(args, standartargs){
        if (args.originChannel != "deadcr1"){
            return standartargs;
        }
        const spotify = require('../src/spotify.js')
        await spotify.addSongToQueue(args.message, args.userIDIsOnWhitelist);
        return standartargs;
    })
}