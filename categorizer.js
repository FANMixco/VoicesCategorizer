var langList = document.getElementById('langList');
var orderedLang;
var firstLang;

// Start an html table for languages details
var text = '<table border=1><tr><th>Default<th>Language<th>Local<th>Name<th>URI</tr>';

function getLang(lng) {
    let lngSplit = lng.split('-');

    if (lngSplit[0] in orderedLang) {
        let found = false;
        for (let i=0; i<orderedLang[lngSplit[0]].length; i++) {
            if (orderedLang[lngSplit[0]][i].lang == lng) {
                found = true;
                break;
            }
        }

        if (found) {
            return lng;
        }
        else {
            return orderedLang[lngSplit[0]][0].lang;
        }
    }
    else {
        return '';
    }
}

// Get voices; add to table markup
function loadVoices() {
    let voices = speechSynthesis.getVoices();
    voices.forEach(function(voice, i) {
        // Add all details to table
        text += `<tr><td>${voice.default}<td>${voice.lang}<td>${voice.localService}<td>${voice.name}<td>${voice.voiceURI}`;
    });
}

function orderVoicesByLanguage() {
    let voices = speechSynthesis.getVoices();
    voices.forEach(function(voice, i) {
        let lng = voice.lang.split('-');
        let collection = { "lang": voice.lang, "isLocal": voice.localService, "name": voice.name, "URI": voice.voiceURI, "default": voice.default };

        if (!orderedLang) {
            let key = lng[0];
            let obj = {
                [key]: [collection]
            };

            orderedLang = obj;
        }
        else if (!(lng[0] in orderedLang)) {
            let key = lng[0];
            let obj = {
                [key]: [collection]
            };

            orderedLang = { ...orderedLang, ...obj };
        } else {
            let key = lng[0];
            orderedLang[key].push(collection);
        }
    });
}

if ('speechSynthesis' in window) {

    loadVoices();
    langList.innerHTML = text;
    // Chrome loads voices asynchronously.
    window.speechSynthesis.onvoiceschanged = function(e) {
        loadVoices();
        langList.innerHTML = text;
        orderVoicesByLanguage();

        getLang('en-US');
    }
}