exports.execute = {
    name:"livemsg",
    description:"Enables/disables livemsg for the specified channel",
    usage:"livemsg add/remove <channel>",
    Roles: ROLES.CHANNEL_MODERATOR,
    code:(async function livemsg(args, standartargs){
        const util = require('../src/util.js');
        let mes = args.message.split(" ");
        let name = mes[2];
        let id = await util.getUserIdByUserName(name);
        if(standartargs.util_obj.subscribed[id]){
            if (standartargs.util_obj.subscribed[id].includes(args.idsender)){
                util.send(args, standartargs, `Notifications for ${name} already enabled`);
                return standartargs;
            }  
        }

        if (mes[1] == "add"){
            let response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                body: JSON.stringify({"type": "stream.online","version": "1","condition": {"broadcaster_user_id": `${id}`},"transport": {"method": "websocket", "session_id": standartargs.eventid}}),
                headers: {
                  "Authorization": `Bearer ${util.oAuth}`,
                  "Client-Id": util.CLIENT_ID,
                  "Content-Type": "application/json"
                },
                method: "POST"
                }
                ).then(data => data).catch(error => console.log(error));
                if(standartargs.util_obj.subscribed[id]){
                    standartargs.util_obj.subscribed[id].push(args.originChannelID);
                }else{
                    standartargs.util_obj.subscribed[id] = [args.originChannelID];
                }
                util.save(standartargs.util_obj, '../data/util.json');

            util.send(args, standartargs, `You successfully added livemessages for ${name}`);
        }
        else if (mes[1] == "remove"){

        }
        return standartargs;
    })
}