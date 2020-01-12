const settings = require("../../settings");

module.exports = async function(e){
    const bot = e.bot; const msg = e.message; const data = e.data;

    console.log(await settings("groups"));
    

    bot.sendMessage(msg.chat.id, `
        Hello World!
    `.trim());
    console.log(e);

}
module.exports.COMMAND = "start";
