exports.execute = {
    name:"7tvadd",
    description:"Adds 7tv emotes",
    usage:"7tvadd <emotename> <optional:emotename> ...",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function stvadd(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let list = util.getEmotename(args);
        if (list == null){
            util.send(args, standartargs,'Please specify an emote.');
            return standartargs;
        }
        util.send(args, standartargs,'Trying to add emotes Loading');
        let ID = await seventv.searchUsersByName(args.originChannel);
        let setID = await seventv.getEmoteSet(ID);
        let auth = await seventv.getAuth(ID);
        if (auth == null){
            util.send(args, standartargs,'ERROR: Insufficient Privileges');
            return standartargs;
        }
        for (var name of list){
            let emote = await seventv.getData(name);
            if (emote == null){
                util.send(args, standartargs,'ERROR: Emote ${name} not found');
                continue;
            }
            seventv.editEmoteSet(setID, emote.id, emote.name, "ADD", auth);
        }
        util.send(args, standartargs,'Successfully added emotes');
        return standartargs;
    })
}   