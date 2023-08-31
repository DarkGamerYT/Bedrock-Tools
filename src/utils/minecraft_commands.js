const CommandManager = {
    Commands: JSON.parse(require( "node:fs" ).readFileSync( __dirname + "/data/commands.json" )),
    validateCommand: (cmd) => {
        const commandName = cmd.split(" ")[0];
        const command = Commands.commands.find((c) => c.name == commandName || c.aliases.includes( commandName ));
        
        if (!command) return false;
        
    
        console.log( command );
    },
    getAllCommands: () => {
        const commands = [];
        CommandManager.Commands.commands.forEach(
            (c) => {
                for (const overload of c.overloads) {
                    const command = {
                        aliases: c.aliases,
                        name: c.name,
                        description: c.description,
                        params: [],
                        permission_level: c.permission_level,
                        requires_cheats: c.requires_cheats,
                    };
    
                    for (const param of overload.params) {
                        command.params.push(
                            {
                                is_optional: param.is_optional,
                                name: param.name,
                                type: param.type.name,
                            },
                        );
                    };
    
                    commands.push(command);
                };
            },
        );
    
        return commands;
    },
};