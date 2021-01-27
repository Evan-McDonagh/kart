var sound;
var currentTrack = '01';
var nowPlaying = 'nothing';
var seconds = 0;
var loopTime = 5;
var loopTimeChanged = false;
var paused;
var start = true;
var newTrack;

chrome.storage.sync.set({track: currentTrack})
chrome.storage.sync.set({loopTime: loopTime})


const tracks = ["01", "02"];

sound = new Howl({
    src: ['tracks/mariokart64/' + "01" + '.m4a'],
    loop: true,
    usingWebAudio: true
});

function playTrack(track) {
    // if (paused) return;
    nowPlaying = track;
    if (currentTrack == track) {
        if (!sound.playing()) sound.play();
    } else {
        currentTrack = track;
        sound.stop();
        sound = new Howl({
            src: ['tracks/mariokart64/' + currentTrack + '.m4a'],
            loop: true,
            usingWebAudio: true
        });
        sound.play();
        chrome.storage.sync.set({track: currentTrack})
    }
} 

function nextTrack() {
    newTrack = tracks[parseInt(currentTrack) % tracks.length]
    playTrack(newTrack); 
}

function setLoopTime(newtime) {
    if (newtime != 'Never') {
        loopTime = parseInt(newtime);
    } else {
        loopTime = newtime;
    }
    loopTimeChanged = true;
    chrome.storage.sync.set({loopTime: loopTime});
}

function pause() {
    // paused = true;
    sound.pause();
    nowPlaying = "nothing"
}

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        console.log(request);
        if (start) {
            start = false;
            seconds = 0;
        }
        nowPlaying = request.nowPlaying;
        if (sound.playing() && request.pause) {
            pause();
        } else if (!request.pause) {
            // paused = false;
            playTrack(request.nowPlaying);
        } 
        if (request.newTime != loopTime) {
            setLoopTime(request.newTime);
        }
        sendResponse("Now playing" + nowPlaying);
    }
);

function tick() {
    if (loopTimeChanged) {
        seconds = 0;
        loopTimeChanged = false;
    }
    if (sound.playing()) seconds++;
    if (loopTime != 'Never' && seconds >= loopTime && sound.playing()) {
        nextTrack();
        seconds = 0;
    }
}

chrome.browserAction.onClicked.addListener(function() { console.log('icon clicked')});

setInterval(tick,1000);