const firebase = require("./firebase");
const functions = firebase.functions;
const auth = firebase.admin.auth();
const crypto = require("./crypto");
const telegram = require("./telegram");





module.exports = async function verifyTelegramLoginFromWeb(telegramData){
    /*
        Verify telegram login data (from web). If correct, issue a token.
    */
    if(!telegram.verifyTelegramData(telegramData)) return false;

    var uid = telegramData.id;

    return true;
}
