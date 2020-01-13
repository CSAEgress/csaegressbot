const repliesFilters = [
    "event",
];

var callbacks = [];
repliesFilters.forEach(function(name){
    callbacks.push(require("./replies-handlers/" + name));
});


module.exports = function repliesHandler(bot, msg, msgReplied){
    callbacks.forEach(function(f){
        f(bot, msg, msgReplied);
    });
}
