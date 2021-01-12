let playButton = document.getElementById('playButton');
let trackSelect = document.getElementById('trackSelect');
let play = false;
var selectedTrack;

function playTrack(track) {
    chrome.runtime.sendMessage({play: play, nowPlaying: track}, function(response) {
        console.log(response.farewell);
    })
}

playButton.onclick = function(element) {
    selectedTrack = document.getElementById('trackSelect').value;
    play = play ? false : true;
    playTrack(selectedTrack);
}

trackSelect.onchange = function(element) {
    selectedTrack = document.getElementById('trackSelect').value;
    playTrack(selectedTrack);
}