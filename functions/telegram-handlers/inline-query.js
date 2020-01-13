const acl = require("../acl");


async function answerInlineQueryGeneric(bot, id, results, options){
    return await bot.answerInlineQuery(id, results, options);
}



async function inlineQueryHandler(bot, query){
    const inline_query_id = query.id;
    function answer(results, options){
        console.log(":::::::::: reply query ::::::::::::::", inline_query_id, results);
        return answerInlineQueryGeneric(
            bot, inline_query_id, results, options
        );
    }

    // Ignore all queries from unknown users 
    if(!(await acl.isMember(query.from))) return;

    console.log("???????????????????????", query);
    await answer(
        [
            {
                type: "location",
                id: "csaegress.agency/0001",
                latitude: 0,
                longitude: 100,
                title: "这是一个地理坐标",
                /*input_message_content: {
                    message_text: "这是一点文字，为什么这里有文字呢。",
                    parse_mode: "html",
                },*/
            },
            {
                type: "article",
                id: "csaegress.agency/0002",
                title: "活动: GORUCK Star Course 15km",
                input_message_content: {
                    message_text: "大概是活动介绍？",
                    parse_mode: "html",
                },
                url: "https://www.goruck.com",
                description: "法兰克福，2020年3月",
            }
        ],
        {
            is_personal: true,
        }
    );
}



module.exports = function(bot){
    bot.on("inline_query", function(query){
        inlineQueryHandler(bot, query);
    });
}
