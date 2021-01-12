let changeColor = document.getElementById('changeColor');
var selectedTrack;

changeColor.onclick = function(element) {
    selectedTrack = document.getElementById('trackSelect').value;

    chrome.runtime.sendMessage({nowPlaying: selectedTrack}, function(response) {
        console.log(response.farewell);
    });
}