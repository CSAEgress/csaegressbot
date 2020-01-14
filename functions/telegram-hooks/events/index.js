module.exports = function bind(bot){

    bot.onCommand("event", require("./commands"));

    bot.onReply(require("./replies"));

}
