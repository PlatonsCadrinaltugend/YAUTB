exports.execute = {
    name:"7tvadd",
    description:"Adds 7tv emotes",
    usage:"7tvadd <emotename>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function stvadd(args, standartargs){
        const seventv = require('../src/seventv.js');
        const util = require('../src/util.js');
        let name = util.getEmotename(args);
        if (name == null){ 
            util.send(args.messages, args.originChannel, standartargs.socket,'Please specify an emote.');
            return standartargs;
        }
        util.send(args.messages, args.originChannel, standartargs.socket,'Trying to add emote Loading');
        let ID = await seventv.searchUsersByName(args.originChannel);
        console.log(args.originChannel, ID);
        let setID = await seventv.getEmoteSet(ID);
        let auth = await seventv.getAuth(ID);
        if (auth == null){
            util.send(args.messages, args.originChannel, standartargs.socket,'ERROR: Insufficient Privileges');
            return standartargs;
        }
        let emote = await seventv.getData(name);
        if (emote == null){
            util.send(args.messages, args.originChannel, standartargs.socket, `ERROR: Emote ${name} not found`);
        }else{
            seventv.editEmoteSet(setID, emote.id, emote.name, "ADD", auth);
        }        
        return standartargs;
    })
}   