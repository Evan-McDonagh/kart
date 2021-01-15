var sound;
var currentTrack;
var nowPlaying;
var seconds = 0;
var loopTime = 5;
var loopTimeChanged = false;
var paused;
var start = true;
var newTrack;

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
    }
} 

function nextTrack() {
    newTrack = tracks[parseInt(currentTrack) % tracks.length]
    chrome.runtime.sendMessage(
        {track: newTrack},
        function(response) {
            console.log(response);
        }
    )
    playTrack(newTrack); 

}

function setLoopTime(newtime) {
    if (newtime != 'Never') {
        loopTime = parseInt(newtime);
    } else {
        loopTime = newtime;
    }
    loopTimeChanged = true;
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

setInterval(tick,1000);