exports.execute = {
    name:"help",
    description:"Provides usefull information on this Bots Commands.",
    usage:"help <commandname>",
    Roles: ROLES.USER,
    code:(async function help(args, standartargs){
        const fs2= require('fs');
        const util = require('../src/util.js');

        let mes = args.message.split(" ");
        if (mes.length >1){
            commandname = mes[1];
            let path = `../commands/${commandname}.js`
			if(fs2.existsSync(path)){
				let command = require(path);
				console.log(command);
				util.send(args.messages, args.originChannel, standartargs.socket,command.execute.description);
                util.send(args.messages, args.originChannel, standartargs.socket,`/me Usage: ${util.Prefix}${command.execute.usage}`);
			}
        }
        return standartargs;
    })
}