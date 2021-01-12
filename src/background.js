var sound;
var currentTrack;
var nowPlaying;

sound = new Howl({
    src: ['tracks/mariokart64/' + "01" + '.m4a'],
    loop: true,
    usingWebAudio: true
});

function playTrack(track) {
    if (currentTrack == track) {
        nowPlaying = track;
        sound.play();
    } else {
        currentTrack = track;
        nowPlaying = track;
        sound.stop();
        sound = new Howl({
            src: ['tracks/mariokart64/' + currentTrack + '.m4a'],
            loop: true,
            usingWebAudio: true
        });
        sound.play();
    }
} 

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        nowPlaying = request.nowPlaying;
        if (request.play) {
            sound.pause();
            nowPlaying = "nothing";
        } else {
            playTrack(request.nowPlaying);
        }

        sendResponse("Now playing" + nowPlaying);
    }
);