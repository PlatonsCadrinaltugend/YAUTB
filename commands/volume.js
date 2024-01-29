exports.execute = {
    name:"volume",
    code:(function song(args, standartargs){
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