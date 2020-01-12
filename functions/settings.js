/*
Our own settings, remotely stored at Firebase Realtime Database.

These are application settings changable via Telegram, etc. Environment
variables are set via Firebase and is not scope of this module.
*/


const firebase = require("./firebase");

// keep in memory an listener, this will ask settings be cached.
firebase.ref("/settings").on("value", function(){});


module.exports = async function(key, value){
    if(value === undefined){
        // a read operation
        console.log("----------------------");
        const s = (await firebase.ref("/settings/" + key).once("value"));
        return s.val();
    }
    await firebase.ref("/settings/" + key).set(value);
}
