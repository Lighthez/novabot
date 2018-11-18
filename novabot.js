'use strict';

let commands = {
    register: function(id,countryName,countryPassword,color){
        countries[countryName] = {};
        countries[countryName]["password"] = countryPassword;
        countries[countryName]["color"] = color;
        countries[countryName]["user"] = id;
    },

    login: function(id,countryName,countryPassword){
        if(countries[countryName] != undefined && countries[countryName]["password"] == countryPassword){
            countries[countryName]["user"] = id;
        } else {
            console.log("WRONG")
        }
    }
}

let countries = {} //main data object for country stats

OWOP.on(6666666 + 19, raw=>{
    let rawChatMessage = raw;

    let senderInfo = rawChatMessage.match(/^-> (\d)/g);
    let messageContent = rawChatMessage.replace(/^-> \d.*:/g,"")

    if(senderInfo != null){
        let senderId = senderInfo[0].split(" ")[1];
        console.log(senderId);
        parseCommand(senderId,messageContent);
    }

    messageContent = senderInfo = "";
})

function parseCommand(id,content){
     content.split(/\s+/);
}

function botMessageSend(id,message){
    console.log([id,message]);
}
