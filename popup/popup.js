let playButton = document.getElementById('playButton');
let trackSelect = document.getElementById('trackSelect');
let timeSelect = document.getElementById('timeSelect');

chrome.storage.sync.get(['track','loopTime'], function(result) {
    trackSelect.value = result.track;
    timeSelect.value = result.loopTime;
});

let pause = true;
var selectedTrack;
var newTrack = true;
var newTime = timeSelect.value;
var message;

function playTrack(track) {
    message = {
        pause: pause, 
        nowPlaying: track,
        newTrack: newTrack,
        newTime: newTime,
    };
    chrome.runtime.sendMessage(
        message,
        function(response) {
            console.log(response.farewell);
    })
}

// Play/pause button
playButton.onclick = function(element) {
    selectedTrack = document.getElementById('trackSelect').value;
    pause = pause ? false : true;
    playTrack(selectedTrack);
}

// Track select change
trackSelect.onchange = function(element) {
    selectedTrack = document.getElementById('trackSelect').value;
    newTrack = true;
    playTrack(selectedTrack);
}

// Time change
timeSelect.onchange = function(element) {
    newTrack = false;
    newTime = document.getElementById("timeSelect").value;
    playTrack(selectedTrack);
}

// Listen for background changes
chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        document.getElementById('trackSelect').value=request.track;
        selectedTrack = request.track;
        newTrack = true;

        sendResponse("Selected " + request.track);
    }
);

chrome.storage.onChanged.addListener(
    function(changes) {
        trackSelect.value = changes.track.newValue;
    }
)