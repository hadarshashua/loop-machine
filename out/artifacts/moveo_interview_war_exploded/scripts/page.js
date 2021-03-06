
var squaresArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var loopsNamesArray = new Array("resources/loops/120_future_funk_beats_25.mp3", "resources/loops/120_stutter_breakbeats_16.mp3", "resources/loops/FUD_120_StompySlosh.mp3", "resources/loops/GrooveB_120bpm_Tanggu.mp3", "resources/loops/MazePolitics_120_Perc.mp3", "resources/loops/SilentStar_120_Em_OrganSynth.mp3", "resources/loops/Bass%20Warwick%20heavy%20funk%20groove%20on%20E%20120%20BPM.mp3", "resources/loops/electric%20guitar%20coutry%20slide%20120bpm%20-%20B.mp3", "resources/loops/PAS3GROOVE1.03B.mp3");
var audiosArray = [];
var mediaRecorder;
var audioChunks = [];
var audioUrl;
var shouldPlay = false;

$(function() {
    initializeAudioArray();
    loadFromStorage();
    var button = document.getElementById("play-session-button");
    button.classList.add("display-none");
});

function initializeAudioArray() {
    for(i=0; i<loopsNamesArray.length; i++)
    {
        var audio = new Audio(loopsNamesArray[i]);
        audiosArray.push(audio);
    }
}

function loadFromStorage() {
    document.getElementById("load").disabled = (localStorage.getItem("buttons")) ? false : true;
}

function changeSquareState(squareId) {
    var element = document.getElementById(squareId);
    var currState = element.childNodes[0].nodeValue;
    var numOfSquare = squareId.replace( /^\D+/g, ''); // replace all leading non-digits with nothing

    if(currState === "On") {
        element.childNodes[0].nodeValue = "Off";
        element.classList.remove("clicked_square");
        squaresArray[numOfSquare - 1] = 0;
        audiosArray[numOfSquare - 1].pause();
        audiosArray[numOfSquare - 1].currentTime = 0; //get back to start position of audio
    }
    else {
        element.childNodes[0].nodeValue = "On";
        element.classList.add("clicked_square");
        squaresArray[numOfSquare - 1] = 1;
    }
}

function playLoops() {
    shouldPlay = true;
    startLoops();

    setInterval(() => {
        if(shouldPlay)
            startLoops();

    }, 8000);
}

function startLoops() {
    for(i=0; i<squaresArray.length; i++) {
        if(squaresArray[i] === 1) {
            audiosArray[i].loop = true;
            audiosArray[i].play();
        }
    }
}

function stopLoops() {
    shouldPlay = false;

    for(i=0; i<squaresArray.length; i++) {
        if(squaresArray[i] === 1) {
            audiosArray[i].pause();
            audiosArray[i].currentTime = 0;
        }
    }
}

function handleRecording() {
    document.getElementById("switch").checked ? startRecording() : stopRecording();
}

function startRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            var mRecorder = new MediaRecorder(stream);
            mediaRecorder = mRecorder;
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
        });
}

function stopRecording() {
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        audioUrl = URL.createObjectURL(audioBlob);
    });

    mediaRecorder.stop();
    showPlaySessionButton();
}

function showPlaySessionButton() {
    var button = document.getElementById("play-session-button");
    button.classList.remove("display-none");
    button.classList.add("display-flex");
}

function playSession() {
    const audio = new Audio(audioUrl);
    audio.play();
}

function saveUserActions() {
    localStorage.setItem("buttons", JSON.stringify(squaresArray));
    // localStorage.setItem("audioUrl", JSON.stringify(audioUrl));
    // localStorage.setItem("audioChunks", JSON.stringify(audioChunks));
    // localStorage.setItem("mediaRecorder", JSON.stringify(mediaRecorder));
    document.getElementById("load").disabled = false;
}

function RestoreUserActions() {
    squaresArray = JSON.parse(localStorage.getItem("buttons"));
    // var url = JSON.parse(localStorage.getItem("audioUrl"));
    // if (url)
    // {
    //     // audioUrl = url;
    //     audioChunks = JSON.parse(localStorage.getItem("audioChunks"));
    //     const audioBlob = new Blob(audioChunks);
    //     audioUrl = URL.createObjectURL(audioBlob);
    //     // mediaRecorder = JSON.parse(localStorage.getItem("mediaRecorder"));
    //     showPlaySessionButton();
    //
    // }

    for(i=0; i<squaresArray.length; i++) {
        if(squaresArray[i] === 1) {
            var squareId = "square" + (i+1).toString();
            var element = document.getElementById(squareId);
            element.childNodes[0].nodeValue = "On";
            element.classList.add("clicked_square");
        }
    }
}