/*
    Test a message for different criterien.

*/

function isGroupChat(msg){
    return msg.chat && (
        msg.chat.type == "group" || msg.chat.type == "supergroup");
}


function isPrivateChat(msg){
    return (msg.chat && msg.chat.type == "private");
}

module.exports = function test(msg){
    return {
        isGroupChat: () => isGroupChat(msg), 
        isPrivateChat: () => isPrivateChat(msg),
    }
}
