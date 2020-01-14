/*
    Event updater via Location / Picture.

*/

const csaegress = require("../../csaegress");
const finder = /\/event\s([0-9a-z\-]{36})/;
const bot = require("../../telegram").bot;

module.exports = async function(msg, msgReplied){
    // Filter out when you really need to invoke this handler.
    // Only when `msg` is a picture or a location(may contain venue).

    if(!msgReplied.text) return;

    var match = finder.exec(msgReplied.text);
    if(!match) return;

    var eventId = match[1];

    try{
        if(!(msg.photo || msg.location)){
            return;
        } else if(msg.photo){
            await csaegress.events.attributeEvent(
                msg.from.id,
                eventId,
                "photo",
                msg.photo
            );
        } else if (msg.location){
            await csaegress.events.attributeEvent(
                msg.from.id,
                eventId,
                "location",
                msg.location
            );
        }
    } catch(e){
        await bot.sendMessage(msg.chat.id, "修改活动失败。" + e.message);
        return;
    }

    await bot.sendMessage(msg.chat.id, "活动修改成功。");
}
