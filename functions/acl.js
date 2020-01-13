/*
Access Control List


This bot is dedicated to CSAE. It serves only members of several whitelisted
groups as listed in Firebase database.

This module provides verification services for each message handler. It can
check if a user or a group is known. But this module itself doesn't enforce
any such rules.
*/

const settings = require("./settings");

module.exports.isMember = async function(from){
    // Check a user is our member.
    const users = (await settings("users")) || "";
    const id = (undefined !== from.id ? from.id : from);
    return ("," + users + ",").indexOf("," + id + ",") >= 0;
}

module.exports.isGroup = async function(chat){
    // Check a chat is one of our whitelisted groups
    if(!(
        chat.id &&
        (chat.type == "group" || chat.type == "supergroup")
    )) return false;

    const groups = "," + ((await settings("groups")) || "") + ",";
    return groups.indexOf("," + chat.id + ",") >= 0;
}

module.exports.addMember = async function(from){
    const users = (await settings("users")) || "";
    await settings("users", users + "," + from.id);
}
