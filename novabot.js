/*=======================================
variable section
all of the variable stuffs
======================================*/

let genericLoggedOutMessage = "you are not logged in"

let countries = {
    /*
    admin:{
      password:"111rosebud222",
        user: null,
        resources: [Infinity,Infinity,Infinity],
        color:[ 64,64,64],
    },*/
    area: {
        tiles:[

        ]
    },
    
    defaultCountry:{
        password:"def1221",
        color:[64,64,64],
        land:{

        }

    },
    loggedInUsers: {}
} //main data object for country stats

/*=======================================
init section
bot initilization code
======================================*/

//settings 
playAreaSize = 2048;
offset = -(playAreaSize / 4);

function imgToTile(xOffset,yOffset,tileSize,imgSize){
    function mkTile(xOffset,yOffset,height,width){
        let line = [];
        let tile = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                line.push(OWOP.world.getPixel((x + xOffset),(y + yOffset)));
            }
            tile.push(line);
            line = [];
        }
        return tile;
    }

    let line =[];
    let tile =[];

    for (let metaY = 0; metaY < (imgSize / tileSize); metaY++) {
        for (let metaX = 0; metaX < (imgSize / tileSize); metaX++) {
            line.push(mkTile(xOffset,yOffset,tileSize,tileSize));    
        }
        tile.push(line);
        line = [];
    }
}

imgToTile(offset,offset,8,playAreaSize);

/*=======================================
main section
parsing of user commands happens here
======================================*/

OWOP.on(6666666 + 19, raw=>{
    let rawChatMessage = raw;

    let senderInfo = rawChatMessage.match(/^-> (\d+)/g);
    let messageContent = rawChatMessage.replace(/^-> \d.*: /g,"")

    if(senderInfo != null){
        let senderId = senderInfo[0].split(" ")[1];
        console.log(senderId);
        parseCommand(senderId,messageContent);
    }

    messageContent = senderInfo = "";
})

OWOP.on(6666666 + 26, raw=>{
    botMessageSend(raw + "" + "left");
    commands.logout(raw);
})

function parseCommand(id,content){
    //let commandArgs = content.split(/\s+/g);
    let tokens = content.split(/\s+/g);
    let command = tokens.shift();
    tokens.unshift(id);

    if(commands[command] != undefined){
        if(tokens.length == (commands[command].length)){
            commands[command].apply(null,tokens);
        } else {
            commands.help(id,command);
        }
    } else if(command.length > 128) {
        botMessageSend(id,"that's way too long");
    } else {
        botMessageSend(id,`${command} is not a valid command, see the command 'commandList' for commands`);
    }
}

function botMessageSend(id,message){
    OWOP.chat.send(`/tell ${id} ${message}`);
    //console.log([id,message])
}

function addStats(countryName,stats){
    for (let i = 0; i < Object.keys(stats).length; i++) {
        countries[countryName][Object.keys(stats)[i]] = Object.values(stats)[i];
    }
}

function helpLookup(entry) {
    switch(entry){
        case "help":
            return "help <command>: get help on any command by using 'help'";
        case "register":
            return "register <country name> <password> <hex color>: register a country for use in game!";
        case "login": 
            return "login <country name> <password>: log into your country account";
        case "logout":
            return "logout: log out of your country account";
        case "debug":
            return "???";
        case "command_list": 
            return "command_list: get ALL of the commands";
        default:
            return "you are without help.";
    }
}

function makeLandArray(xy){
    return xy.split("|");
}

function makeLandKey(x,y){
    return x+"|"+y;
}

function claimLand(id,x,y,countryName){
    if(verifyUser(id,countryName)) {
        /*
        legacy
        console.log(countries[countryName]["land"]);
        countries[countryName]["land"][makeLandKey(x,y)] = "normal";
        OWOP.world.setPixel(x,y,countries[countryName].color);
        */ 
        //countries.area[]
        countries.area.tiles[y][x%8][y%8]["owner"] = countryName
    }  else {
        botMessageSend(id,genericLoggedOutMessage);
    }
}

function modifyLand(id,x,y,countryName,landValue){
    if(verifyUser(id,countryName)){
        /*
        legacy
        countries[countryName]["land"][makeLandKey(x,y)] = landValue;
        */
    } else {
        botMessageSend(id,genericLoggedOutMessage);
    }
}

function verifyUser(id,countryName){
    //is the user who they claim they are?
    if(countries.loggedInUsers[countryName] == id){
        return true;
    } else {
        return false;
    }
}

/*=======================================
commands section
all commands are defined in this object
======================================*/
let commands = {
    register: function(id,countryName,countryPassword,color){
        countries[countryName] = {};
        addStats(countryName,{"password":countryPassword,"color":color,"resources":[],"land":{},"buildings":{}});
        countries.loggedInUsers[countryName] = id;

        console.log(countries);
        botMessageSend(id,"account created!");
    },

    login: function(id,countryName,countryPassword){
        if(verifyUser(id,countryName)){
            botMessageSend(id,"already logged in")
        } else {
            if(countries[countryName] != undefined && countries[countryName]["password"] == countryPassword){
                //if country is not undefined and password matches, log in the user
                countries.loggedInUsers[countryName] = id;
                botMessageSend(id,"logged in");
            } else {
                botMessageSend(id,"WRONG");
            }
            console.log(countries);
        }
    },

    logout: function(id){
        let wasLoggedIn = false;
        for (let i = 0; i < Object.keys(countries.loggedInUsers).length; i++) {
            if(Object.values(countries.loggedInUsers)[i] == id){
                let keyToDelete = Object.keys(countries.loggedInUsers)[i][0]
                wasLoggedIn = true;
                delete countries.loggedInUsers[keyToDelete];
            }
        }
        
        if(wasLoggedIn){
            botMessageSend(id,"successfully logged out");
        } else {
            botMessageSend(id,genericLoggedOutMessage);
        }
    },

    debug: function(id){
        console.log(`DEBUG INFO: \n countries: ${Object.entries(countries)} \n\n commands: ${Object.entries(commands)}`);
        botMessageSend(id,"uber secret debug info printed");
    },

    help: function(id,command){
        if(commands[command] != undefined){
            botMessageSend(id,"---Command help---");
            botMessageSend(id,helpLookup(command));
        }else{
            botMessageSend(id,`${command} is not a valid command, for a command list, use 'command_list'`);
        }
    },

    command_list: function(id){
        botMessageSend(id,Object.keys(commands)); 
    }
}