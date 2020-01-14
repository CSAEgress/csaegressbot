/*
CSAEGRESS Events Manager

This is the backend manager of events (like those in Google Calendar) for
csaegress. These events may be displayed on websites(csaegress.agency) and
via Telegram Bot. Editions are done via bot, and joining also.

*/

const _ = require("lodash");
const firebase = require("../firebase");
const uuid = require("uuid/v4");


function isEventId(s){
    if(!_.isString(s)) return false;
    return /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/.test(s);
}



/*
    Create or update an event given by "e".
    ---------------------------------------
    int64   uid         Id of Telegram user who created this event.

    str     e.id        If set, the event record with this event id will be
                        updated. If not set, a new record will be created.
    bool    e.public    If this event is public. By default yes.
    str     e.name      Name of this event, also used as title.
    str     e.description
                        Description of this event.

*/
module.exports.updateEvent = async function(uid, e){
    
    var eventId = e.id;
    var createEvent = (!eventId);

    if(createEvent){
        eventId = uuid(); 
    } else {
        if(!isEventId(eventId)){
            throw Error("活动ID不正确！");
        }
    }

    if(!createEvent){
        // assure the event exists, and owner equals uid.
        const currentEvent = (await firebase.ref(eventId).once("value")).val();
        if(!currentEvent){
            throw Error("活动不存在！");
        }
        
        if(currentEvent.owner != uid.toString()){
            throw Error("只有创建者才可以修改活动！");
        }
    }

    await firebase.ref(eventId).set({
        owner: uid.toString(),
        type: "event",
        name: e.name,
        description: e.description,
        public: e.public,
    });

    return eventId;
}



/*
    Assign additional information to an event, or modify them.
    ----------------------------------------------------------

    int64   uid         User id requesting this modification.
    uuid    eventId     UUID for an existing event.
    str     key         A key for an attribute going to be stored or updated.
    str     value       Data for that attribute. When undefined, remove that
                        attribute!

*/
module.exports.attributeEvent = async function(uid, eventId, key, value){
    
    if(!isEventId(eventId)) throw Error("活动ID不正确！");

    const currentEvent = (await firebase.ref(eventId).once("value")).val();
    if(!currentEvent) throw Error("活动不存在！");

    if(currentEvent.owner != uid.toString()){
        throw Error("只有创建者才可以修改活动！");
    }

    return await firebase.ref(eventId).child(key).set(JSON.stringify(value));
}



module.exports.queryEvent = async function(eventId){
    if(!isEventId(eventId)) throw Error("活动ID不正确！");

    return (await firebase.ref(eventId).once("value")).val();
}
