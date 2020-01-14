const settings = require("../../settings");
const tg = require("../../telegram");
const bot = tg.bot;

async function startCommandHandler(msg, data){
    bot.sendMessage(msg.chat.id, `
        Hello World!
    `.trim());
}

module.exports = function bind(bot){
    bot.onCommand("start", startCommandHandler);
}
