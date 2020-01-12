/*
Chat Message Dispatcher

Dispatch received chat messages to respected handlers. Only registered chats
will be regarded, all other messages are filtered without any action.


*/

const settings = require("../settings");


module.exports = function(bot){
    bot.on("message", async function(msg){
        if(!(msg.from && msg.from.id && !msg.from.is_bot)) return;
        if(!(msg.chat && msg.chat.id)) return;

        const groups = "," + ((await settings("groups")) || "") + ",";
        if(groups.indexOf("," + msg.chat.id + ",") < 0){
            // deny service for chats not whitelisted.
            return;
        }

        const users = (await settings("users")) || "";
        if(("," + users + ",").indexOf("," + msg.from.id + ",") < 0){
            // this user is new to us. remember it.
            await settings("users", users + "," + msg.from.id);
            console.log("caught", msg.from.id, "from chat", msg.chat.id);
        }

        // User monitor is done. Message should be discarded for now. For
        // further extensions, code below and pass message & bot to handlers.
    });
}
