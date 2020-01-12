/*
Dispatcher for all commands.


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
];




const eventEmitter = new (require("events").EventEmitter)();

function commandHandler(bot, message, regexpResult){
    const command = regexpResult[1];
    const data = regexpResult[2];
    eventEmitter.emit(command, {
        bot: bot, 
        data: data,
        message: message
    });
}

module.exports = function(bot){
    bot.onText(/^\/([a-zA-Z]+)(\s.+)?$/, function(message, regexpResult){
        commandHandler(bot, message, regexpResult);
    });
};

commands.forEach(function(commandName){
    const handler = require("./command-handlers/" + commandName);
    eventEmitter.on(handler.COMMAND, handler);
});
