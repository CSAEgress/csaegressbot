const admin = require("firebase-admin");
const functions = require("firebase-functions");

const is_dev = (
    functions.config().development &&
    true === functions.config().development.mode
);

if(functions.config().adminsdk){
    const credential = admin.credential.cert(functions.config().adminsdk);
    admin.initializeApp({ credential: credential });
} else {
    admin.initializeApp();
}



module.exports = {
    "is_dev": is_dev,
    "admin": admin,
    "functions": functions,
    "ref": (x) => admin.database().ref(x),
    "config": JSON.parse(process.env.FIREBASE_CONFIG),
};
