/*
Dispatcher for all communications started within private chat with bot.

*/




const commandHandler = require("./private-chat.commands");
const repliesHandler = require("./private-chat.replies");


function isPrivateChat(chat){
    return (chat && chat.type == "private");
}


module.exports = function(bot){

    // capture all commands

    bot.onText(/^\s?\/([^\s]{1,30})(\s.+)?$/s, function(msg, regexpResult){
        if(!isPrivateChat(msg.chat)) return;
        commandHandler(bot, msg, regexpResult);
    });

    // capture all text: note this also includes command texts!
    bot.on("message", function(msg){
        if(!isPrivateChat(msg.chat)) return;
        if(!msg.reply_to_message) return;
        repliesHandler(bot, msg, msg.reply_to_message);
    });

};

