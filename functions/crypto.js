const crypto = require("crypto");


module.exports.SHA256 = function(data){
    const hash = crypto.createHash('sha256');
    hash.update(data);

    var ret = hash.digest();
    ret.hex = ret.toString("hex");
    return ret;
}

module.exports.SHA256_HMAC = function(key, data){
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);

    var ret = hmac.digest();
    ret.hex = ret.toString("hex");
    return ret;
}
