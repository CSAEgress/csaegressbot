/* 
    Syntax: /event <new|event-id> [event-data]
                   ~~~~~~~~~~~~~~ ~~~~~~~~~~~~
                   action         event-data

    If event-data is not set:
        o If action is "new", it equals a pure /event command without
          parameters. An instruction for new event creation is given.
        o If action is set, the bot tries to query for that event, and displays
          in format /event <event-id> [event-data].
    If event-data is set:
        o If action is "new", tries to create a new event. The bot then displays
          the new event as if a query is done.
        o If action is set, the bot tries to update the event with new data.
          The event must exist and created by the same user.
    
*/

const _ = require("lodash");
const yaml = require("yaml");
const csaegress = require("../../csaegress");
const acl = require("../../acl");



/*
Parser for user input on specifying an event.
*/

function parseUserEventInput(data){
    
    var split = /^(.+)\n\-{3,6}\n(.+)$/s.exec(data);
    if(!split) throw Error("完全看不懂！");

    try{
        var yamldoc = yaml.parse(split[1].trim());
    } catch(e){
        throw Error("格式写错了！");
    }
    var description = split[2].trim();

    if(!(
        yamldoc.name &&
        _.isString(yamldoc.name) &&
        yamldoc.name.length <= 100 &&
        yamldoc.name.length >= 3
    )){
        throw Error("活动名字要在3到100个字之间！");
    }

    const isPublicTranslation = {
        "y": true, "yes": true, "是": true, "公开": true, "true": true,
        "1": true,

        "n": false, "no": false, "否": false, "不公开": false,
        "false": false, "私有": false, "私密": false, "0": false,
    };

    if(isPublicTranslation[yamldoc.public] === undefined){
        throw Error("要决定是不是公开分享！");
    }
    yamldoc.public = isPublicTranslation[yamldoc.public];

    
    return {
        name: yamldoc.name,
        public: yamldoc.public,
        description: description,
    }
}


/*
Command handler

*/
module.exports = async function(e){
    const bot = e.bot; const msg = e.message; const data = e.data;

    const isMember = await acl.isMember(msg.from);


    var eventId = null, eventData = null;
    if(data){
        var regexec = /^([0-9a-z\-]{1,40})(\s(.+))?$/s.exec(data.trim());
        if(null == regexec){
            await bot.sendSticker(msg.chat.id, bot.stickers.unhappy);
            await bot.sendMessage(msg.chat.id, "菜菜听不懂你要说什么。");
            return;
        }
        eventId = regexec[1];

        try{
            if(regexec[2]){
                eventData = parseUserEventInput(regexec[2]);
            }
        } catch(e){
            await bot.sendSticker(msg.chat.id, bot.stickers.error);
            await bot.sendMessage(
                msg.chat.id,
                "菜菜看不懂你的输入！" + e.message
            );
            return;
        }
    }

    // If not member, warn before trying to create event
    if(!isMember && (!eventId || "new" == eventId)){
        await bot.sendSticker(msg.chat.id, bot.stickers.stop);
        await bot.sendMessage(
            msg.chat.id,
            [
                "只有菜格瑞斯的成员才能发起活动。",
                "菜菜需要在群里见到你说过话，才会记住你哦。",
            ].join("\n"),
            { parse_mode: "markdown" }
        );
        return;
    }


    // If /event or /event new

    if(!eventId || (eventId == "new" && !eventData)){
        bot.sendMessage(
            msg.chat.id,
            [
                "要发起活动，请点击复制下面的模板，修改< >标记的内容。",
                "\n```",
                "/event new",
                "name: <请修改活动名字>",
                "public: <true|false>, # 是否公开（在网站上发布）",
                "---",
                "<请输入活动介绍，可以多行>",
                "```\n",
                "再把修改好的模板发送给我。您可以稍后修改活动的地点。",
            ].join("\n"),
            {
                parse_mode: "markdown",
            }
        );
        return;
    }


    var updatedEventId = null;

    // /event new <data>
    
    if("new" == eventId){
        // create a new event
        try{
            updatedEventId = await csaegress.events.updateEvent(
                msg.from.id,
                eventData
            );
        } catch(e){
            await bot.sendMessage(msg.chat.id, "创建活动失败！" + e.message);
            return;
        }


        bot.sendMessage(
            msg.chat.id,
            [
                "新活动已经保存。 **活动名称:**\n",
                eventData.name,
                "\n请用下面的命令查看:\n",
                "```",
                "/event " + updatedEventId,
                "```\n",
                "要为活动增加背景图或者地点，请在下面用相应图片、坐标或场所" +
                "(可借助 @foursquare 这样的机器人检索)回复上面任意包含这一活动" +
                "编号的消息。",
            ].join("\n"),
            { parse_mode: "markdown" }
        );
        return;
    }
    
    // /event <event-id>, either with or without data

}
module.exports.COMMAND = "event";
