/*

Commands handler are located in sub-directory ./command-handlers. Each handler
there exports a function taking a single variable as input. That function
has an attribute `COMMAND` telling this dispatcher which command it listens.

The variable passed to command handler function has following attributes:

    bot: the Telegram bot
    data: the data as parsed by regexp
    message: the original message

*/


const commands = [ // All commands to be loaded are here
    "start",
    "event",
];

const eventEmitter = new (require("events").EventEmitter)();

function commandHandler(bot, msg, regexpResult){

    const command = regexpResult[1];
    const data = regexpResult[2];
    eventEmitter.emit(command, {
        bot: bot, 
        data: data ? data.trim() : undefined,
        message: msg,
    });
}

commands.forEach(function(commandName){
    const handler = require("./command-handlers/" + commandName);
    if(handler.COMMAND){
        eventEmitter.on(handler.COMMAND, handler);
    }
    if(handler.COMMANDS){
        handler.COMMANDS.forEach(function(command){
            eventEmitter.on(command, handler);
        });
    }
});

module.exports = commandHandler; 
