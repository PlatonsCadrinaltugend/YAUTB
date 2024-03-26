exports.execute = {
    name:"7tvremove",
    description:"Removes 7tv emotes",
    usage:"7tvremove <emotename> <optional:emotename> ...",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function ping(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let list = util.getEmotename(args);
        if (list == null){
            util.send(args, standartargs,'Please specify an emote.');
            return standartargs;
        }
        let ID = await seventv.searchUsersByName(args.originChannel);
        let setID = await seventv.getEmoteSet(ID);
        let auth = await seventv.getAuth(ID);
        if (auth == null){
            util.send(args, standartargs,'ERROR: Insufficient Privileges');
            return standartargs;
        }
        util.send(args, standartargs,'Trying to remove emotes Loading');
        for (var name of list){
            let emote = await seventv.getEmoteInSet(name, setID);
            if (emote == null){
                util.send(args, standartargs,'ERROR: Emote ${name} not found');
                continue;
            }
            seventv.editEmoteSet(setID, emote.id, emote.name, "REMOVE", auth);
        }
        util.send(args, standartargs,'Successfully removed emotes');
        return standartargs;
    })
}   