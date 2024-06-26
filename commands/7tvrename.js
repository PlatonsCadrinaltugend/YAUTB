exports.execute = {
    name:"7tvrename",
    description:"Rename 7tv emotes",
    usage:"7tvrename <emotename> <new name>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function stvadd(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let name = util.getEmotename(args);
        if (name == null){
            util.send(args.messages, args.originChannel, standartargs.socket,'Please specify an emote.');
            return standartargs;
        }
        let newname = null;
        if (args.message.split(" ").length>2){
            newname = args.message.split(" ")[2];
        }
        if (newname == null){
            util.send(args.messages, args.originChannel, standartargs.socket,'New name is undefined');
            return standartargs;
        }
        console.log(name, newname);
        util.send(args.messages, args.originChannel, standartargs.socket,`Trying to rename emote ${name} Loading`);
        let ID = await seventv.searchUsersByName(args.originChannel);
        let setID = await seventv.getEmoteSet(ID);
        let auth = await seventv.getAuth(ID);
        let emote = await seventv.getEmoteInSet(name, setID);
        if (emote == null){
            util.send(args.messages, args.originChannel, standartargs.socket,'ERROR: Emote not found');
            return standartargs;
        }
        if (auth == null){
            util.send(args.messages, args.originChannel, standartargs.socket,'ERROR: Insufficient Privileges');
            return standartargs;
        }
        seventv.editEmoteSet(setID, emote.id, newname, "UPDATE", auth);
        return standartargs;
    })
}   