/*
    Event updater via Location / Picture.

*/

const finder = /\/event\s([0-9a-z\-]{36})/;

module.exports = async function(bot, msg, msgReplied){
    // Filter out when you really need to invoke this handler.
    // Only when `msg` is a picture or a location(may contain venue).

    if(!msgReplied.text) return;

    var match = finder.exec(msgReplied.text);
    if(!match) return;

    var eventId = match[1];

    if(!(msg.photo || msg.location)) return;

    console.log(msg.photo);

    console.log(msg.location);
    
}
