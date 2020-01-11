const functions = require("./firebase").functions;
const crypto = require("./crypto");



/* Read and export Telegram token */

const TELEGRAM_TOKEN = functions.config().telegram.key;

if(!TELEGRAM_TOKEN){
    console.warn(
        "FATAL: Telegram bot token not set. This will not work.\n" +
        "Please run:\n  firebase functions:config:set telegram.key=\"<TELEGRAM BOT TOKEN>\"+\n" +
        "to set up environment variable."
    );
}

module.exports.token = TELEGRAM_TOKEN;



/* Function for verifying telegram web login data */

module.exports.verifyTelegramData = (function(){
    const TELEGRAM_SECRET_KEY = crypto.SHA256(TELEGRAM_TOKEN);

    function getDataCheckString(telegramData){
        var keys = telegramData.keys().sort();
        var output = [];
        keys.forEach(function(key){
            if(key == "hash") return;
            output.push(key + "=" + telegramData[key]);
        });
        return output.join("\n");
    }

    return function(telegramData){
        const hash = crypto.SHA256_HMAC(
            TELEGRAM_SECRET_KEY,
            getDataCheckString(telegramData)
        ).hex;
        console.debug("Verify telegram login:", hash, telegramData);
        return hash == telegramData.hash;
    }
})();



/* Initialize bot */
