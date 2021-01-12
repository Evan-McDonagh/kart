var sound;
var currentTrack;
var nowPlaying;

sound = new Howl({
    src: ['../tracks/mariokart64/' + "01" + '.m4a'],
    loop: true,
    usingWebAudio: true
});

function playTrack(sound,track) {
    sound.src = ['../tracks/mariokart64/' + track + '.m4a']
    sound.play();
} 

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        nowPlaying = request.nowPlaying;
        console.log(request.nowPlaying);
        if (sound.playing()) {
            sound.pause();
            nowPlaying = "nothing"
        }
        else if (!sound.playing() && request.nowPlaying != currentTrack) {
            currentTrack = request.nowPlaying;
            playTrack(sound,request.nowPlaying);
        }
        else if (!sound.playing() && request.nowPlaying == currentTrack) {
            sound.play();
        }
        sendResponse("Now playing" + nowPlaying);
    }
);