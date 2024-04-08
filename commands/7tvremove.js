exports.execute = {
    name:"7tvremove",
    description:"Removes 7tv emotes",
    usage:"7tvremove <emotename>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function ping(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let name = util.getEmotename(args);
        if (name == null){
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
        util.send(args, standartargs,'Trying to remove emote Loading');
        let emote = await seventv.getEmoteInSet(name, setID);
        if (emote == null){
            util.send(args, standartargs,`ERROR: Emote ${name} not found`);
        }
        else{
            seventv.editEmoteSet(setID, emote.id, emote.name, "REMOVE", auth);

        }    
        return standartargs;
    })
}   