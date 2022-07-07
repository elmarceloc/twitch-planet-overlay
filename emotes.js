// get channel from url params
const urlParams = new URLSearchParams(window.location.search);
const channel = urlParams.get('channel');

if (channel) {
    console.log(`Channel: ${channel}`);
}

let emotes = [];

async function getEmotes() {
    function returnResponse(response) {
        return response.json();
    }

    // const proxyurl = 'https://cors-anywhere.herokuapp.com/';  https://tpbcors.herokuapp.com/
    const proxyurl = "https://tpbcors.herokuapp.com/";
    let twitchID;

    // get channel twitch ID
    let res = await fetch(proxyurl + "https://api.ivr.fi/twitch/resolve/" + channel, {
        method: "GET",
        headers: { "User-Agent": "api.roaringiron.com/emoteoverlay" },
    }).then(returnResponse);
    if (!res.error || res.status == 200) {
        twitchID = res.id;
    }

    // get FFZ emotes
    res = await fetch(proxyurl + "https://api.frankerfacez.com/v1/room/" + channel, {
        method: "GET",
    }).then(returnResponse);

    if (!res.error) {
        addFFZemotes(res.sets)
    }

    // get all global ffz emotes
    res = await fetch(proxyurl + "https://api.frankerfacez.com/v1/set/global", {
        method: "GET",
    }).then(returnResponse);
    if (!res.error) {
        addFFZemotes(res.sets)
    }

    // get all BTTV emotes
    res = await fetch(proxyurl + "https://api.betterttv.net/3/cached/users/twitch/" + twitchID, {
        method: "GET",
    }).then(returnResponse);
    if (!res.message) {
        addBttvEmotes(res.channelEmotes)
        addBttvEmotes(res.sharedEmotes)
    } 
    // global bttv emotes
    res = await fetch(proxyurl + "https://api.betterttv.net/3/cached/emotes/global", {
        method: "GET",
    }).then(returnResponse);
    if (!res.message) {
        addBttvEmotes(res)
    }

    // get all 7TV emotes
    res = await fetch(proxyurl + `https://api.7tv.app/v2/users/${channel}/emotes`, {
        method: "GET",
    }).then(returnResponse);
    if (!res.error || res.status == 200) {
        if (res.Status === 404) {
            totalErrors.push("Error getting 7tv emotes");
        } else {
            for (var i = 0; i < res.length; i++) {
                let emote = {
                    emoteName: res[i].name,
                    emoteURL: res[i].urls[1][1],
                };
                emotes.push(emote);
            }
        }
        // get all 7TV global emotes
        res = await fetch(proxyurl + `https://api.7tv.app/v2/emotes/global`, {
            method: "GET",
        }).then(returnResponse);
        if (!res.error || res.status == 200) {
            if (res.Status === 404) {
                totalErrors.push("Error getting 7tv global emotes");
            } else {
                addSeventvEmotes(res)
            }
        }
    }

}


function addEmote(name, url){
    let emote = {
        emoteName: name,
        emoteURL: url,
    };
    emotes.push(emote);
}

function addFFZemotes(sets){
    let setName = Object.keys(sets);
    for (var k = 0; k < setName.length; k++) {
        for (var i = 0; i < sets[setName[k]].emoticons.length; i++) {
            const emoteURL = sets[setName[k]].emoticons[i].urls["4"] ? sets[setName[k]].emoticons[i].urls["4"] : sets[setName[k]].emoticons[i].urls["1"];
  
            addEmote(sets[setName[k]].emoticons[i].name, "https://" + emoteURL.split("//").pop())
        }
    }
}

function addBttvEmotes(group){
    for (var i = 0; i < group.length; i++) {
        addEmote(group[i].code, `https://cdn.betterttv.net/emote/${group[i].id}/2x`)
    }
}

function addSeventvEmotes(group){
    for (var i = 0; i < group.length; i++) {
        addEmote( group[i].name, group[i].urls[1][1])
    }
}

getEmotes()