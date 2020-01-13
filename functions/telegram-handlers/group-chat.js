/*
Chat Message Dispatcher

Dispatch received chat messages to respected handlers. Only registered chats
will be regarded, all other messages are filtered without any action.


*/

const acl = require("../acl");


module.exports = function(bot){
    bot.on("text", async function(msg){

        // If message not from a whitelisted chat
        if(!(await acl.isGroup(msg.chat))){
            // If msg.chat is still a group, leave that group to avoid
            // disturbing us.
            if(msg.chat.type == "group" || msg.chat.type == "supergroup"){
                await bot.sendMessage(
                    msg.chat.id,
                    "菜菜只能给菜格瑞斯的几个群使用，告辞。\n" +
                    "如果您认为菜菜应当留下，" +
                    "<a href=\"https://t.me/csaegressbot?start=whitelist_" +
                    msg.chat.id +
                    "\">请点击这里登记本群</a>，然后重新将它加回来。",
                    {
                        parse_mode: "html",
                    }
                );
                await bot.sendSticker(msg.chat.id, bot.stickers.leave);
                await bot.leaveChat(msg.chat.id);
            }
            return;
        }

        // If message is not from a known member, add that member
        if(!(await acl.isMember(msg.from))){
            await acl.addMember(msg.from);
            console.log("caught", msg.from.id, "from chat", msg.chat.id);
        }

        // User monitor is done. Message should be discarded for now. For
        // further extensions, code below and pass message & bot to handlers.
        

        // for test only
        if(msg.text){
            bot.sendMessage(msg.chat.id, msg.text);
        }

    });
}
