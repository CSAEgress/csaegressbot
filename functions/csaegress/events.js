/*
CSAEGRESS Events Manager

This is the backend manager of events (like those in Google Calendar) for
csaegress. These events may be displayed on websites(csaegress.agency) and
via Telegram Bot. Editions are done via bot, and joining also.

*/

const firebase = require("../firebase");
const uuid = require("uuid/v4");


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
    }


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
}
