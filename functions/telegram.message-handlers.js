const onCommandHandlers = {};
const onReplyHandlers = [];

function registerHandler(to, key, callback){
    if(to[key] === undefined){
        to[key] = [];
    }
    to[key].push(callback);
}


module.exports = function modifier(bot){

    /* onCommand(msg, data) handler  */

    bot.onCommand = function(command, callback){
        /* Register command and callback to onCommand method. */
        registerHandler(onCommandHandlers, command, callback);
    }

    bot.onText(/^\s?\/([^\s]{1,30})(\s.+)?$/s, function(msg, regexpResult){
        const command = regexpResult[1],
              data = regexpResult[2];
        if(onCommandHandlers[command] === undefined) return;
        onCommandHandlers[command].forEach(function(callback){
            callback(msg, data !== undefined ? data.trim() : undefined);
        });
    });

    /* onReply(msg, repliedMsg) handler */

    bot.onReply = function(callback){
        onReplyHandlers.push(callback);
    }

    bot.on("message", function(msg){ 
        if(!msg.reply_to_message) return;
        onReplyHandlers.forEach(function(callback){
            callback(msg, msg.reply_to_message);
        });
    });



}
