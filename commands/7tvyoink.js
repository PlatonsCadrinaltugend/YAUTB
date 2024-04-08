exports.execute = {
    name:"7tvadd",
    description:"Adds 7tv emotes",
    usage:"7tvyoink <channel> <emote>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function stvadd(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let mes = args.message.split(" ");
        if(mes.length<3){
            util.send(args, standartargs,'ERROR: Missing Arguments');
        }
        let name = mes[2];
        if (name == null){
            util.send(args, standartargs,'Please specify an emote.');
            return standartargs;
        }
        let channel = mes[1];
        if (channel == null){
            return standartargs;
        }
        util.send(args, standartargs,'Trying to yoink emote Loading');
        let channelID = await seventv.searchUsersByName(channel);
        let channelSetID = await seventv.getEmoteSet(channelID);
        let ID = await seventv.searchUsersByName(args.originChannel);
        let setID = await seventv.getEmoteSet(ID);
        let auth = await seventv.getAuth(ID);
        if (auth == null){
            util.send(args, standartargs,'ERROR: Insufficient Privileges');
            return standartargs;
        }
        let emote = await seventv.getEmoteInSet(name, channelSetID);
        if (emote == null){
            util.send(args, standartargs,`ERROR: Emote ${name} not found`);
            return standartargs;
        }
        seventv.editEmoteSet(setID, emote.id, emote.name, "ADD", auth);
        return standartargs;
    })
}   