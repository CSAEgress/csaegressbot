/*
Telegram-related Functionalities.

1. Initializes a telegram bot
2. Exports some functions related with Telegram.
3. Set up webhook with express app.
4. Load hooks of functionalities defined for our bot.

exports:
    bot: the TelegramBot instance.
    verifyTelegramData: a function verifying Telegram web login responses.
*/

const hooks = [
    "csaegress-acl-enforcing-and-updating",
    "command-start",
    "events",
];




const firebase = require("./firebase");
const functions = firebase.functions;
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

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(TELEGRAM_TOKEN);
const app = require("./app");

console.debug("Telegram bot started.");

const webhookPath = "/webhook/" + TELEGRAM_TOKEN;
const webhookURL =
    (firebase.is_dev ? 
        "https://dev.nerv.agency/api" :
        (
            "https://us-central1-" + firebase.config.projectId +
            ".cloudfunctions.net/api"
        ) 
    )
    + webhookPath;

bot.setWebHook(webhookURL);
console.log("Telegram bot webhook set to:", webhookURL);
console.log(
    "To verify your webhook setting, visit:\n" +
    "   https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/getWebhookInfo"
);

app.post(webhookPath, function(req, res){
    console.debug("\n", req.body, "\n");

    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get(webhookPath, function(req, res){
    res.status(405).send("Almost there! Use POST.");
});

module.exports.bot = bot;


/* Add additonal message handlers to bot. */
require("./telegram.message-handlers")(bot);


/* Load bot handlers */

hooks.forEach(function(name){
    require("./telegram-hooks/" + name + "/index")(bot);
});





/* Load stickers to `bot` object. */
module.exports.bot.stickers = require("./telegram.stickers");


/* Message tester */
module.exports.test = require("./telegram.test");
