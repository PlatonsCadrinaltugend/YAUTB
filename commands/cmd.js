exports.execute = {
    name:"commands",
    description:"Shows all available commands",
    usage:"cmd",
    Roles: ROLES.ADMIN,
    code:(async function cmd(args, standartargs){
        const util = require('../src/util.js');
        let data = util.FileSystem.readdirSync(`../commands/`); 
        console.log(data);
        let cmds = "";
        for (var elem of data){
            elem = elem.split(".js")[0];
            cmds += elem + ", ";
        }
        cmds = cmds.split(", ").reverse();
        cmds.shift();
        cmds = cmds.reverse().join(", ");
        util.send(args, standartargs,'Available Commands: ${cmds}');
        return standartargs;
    })
}