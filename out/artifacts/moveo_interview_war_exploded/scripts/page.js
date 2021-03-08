const AUDIO_LENGTH_MILLISECONDS = 8000;

let squaresArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const loopsNamesArray = new Array("resources/loops/120_future_funk_beats_25.mp3", "resources/loops/120_stutter_breakbeats_16.mp3", "resources/loops/FUD_120_StompySlosh.mp3", "resources/loops/GrooveB_120bpm_Tanggu.mp3", "resources/loops/MazePolitics_120_Perc.mp3", "resources/loops/SilentStar_120_Em_OrganSynth.mp3", "resources/loops/Bass%20Warwick%20heavy%20funk%20groove%20on%20E%20120%20BPM.mp3", "resources/loops/electric%20guitar%20coutry%20slide%20120bpm%20-%20B.mp3", "resources/loops/PAS3GROOVE1.03B.mp3");
const audiosArray = [];
let mediaRecorder;
let audioChunks = [];
let audioUrl;
let audioRecord;
let shouldPlay = false;

$(function() {
    initializeAudioArray();
    loadFromStorage();
    $("#play-session-button").addClass("display-none");
    $("#audio").attr("crossOrigin", "anonymous");
});

function initializeAudioArray() {
    for(i=0; i<loopsNamesArray.length; i++) {
        audiosArray.push(new Audio(loopsNamesArray[i]));
    }
}

function loadFromStorage() {
    $("#load").prop("disabled",(localStorage.getItem("buttons")) ? false : true);
}

function changeSquareState(squareId) {
    const element = document.getElementById(squareId);
    const currState = element.childNodes[0].nodeValue;
    const numOfSquare = squareId.replace( /^\D+/g, ''); // replace all leading non-digits with nothing

    if(currState === "On") {
        element.childNodes[0].nodeValue = "Off";
        element.classList.remove("clicked_square");
        squaresArray[numOfSquare - 1] = 0;
        audiosArray[numOfSquare - 1].pause();
        audiosArray[numOfSquare - 1].currentTime = 0; //get back to start position of audio
    } else {
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
    }, AUDIO_LENGTH_MILLISECONDS);
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
    $("#switch").is(':checked') ? startRecording() : stopRecording();
}

function startRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
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
        $("#audio").attr('src', audioUrl);
        // audioRecord = new Audio(audioUrl);
    });

    mediaRecorder.stop();
    showPlaySessionButton();
}

function showPlaySessionButton() {
    const button = $("#play-session-button");
    button.removeClass("display-none");
    button.addClass("display-flex");
}

function playSession() {
    //const audio = new Audio(document.getElementById("audio"));
    document.getElementById("audio").play();
    //const audio = new Audio($("#audio"));
    //audio.play().then(()=>{}).catch(err => console.log(err));
    //audioRecord = new Audio(audioUrl);
    //audio.play();
}

function saveUserActions() {
    localStorage.setItem("buttons", JSON.stringify(squaresArray));
    //localStorage.setItem("audioRecord", audioRecord);
    localStorage.setItem("audioUrl", audioUrl);
    //localStorage.setItem("audioChunks", JSON.stringify(audioChunks));
    //localStorage.setItem("mediaRecorder", JSON.stringify(mediaRecorder));
    $("#load").attr("disabled", false);
}

function RestoreUserActions() {
    squaresArray = JSON.parse(localStorage.getItem("buttons"));
    let url = localStorage.getItem("audioUrl");
    //let audioChunksFromStorage = JSON.parse(localStorage.getItem("audioChunks"));
    if (url)
    {
        audioUrl = url;
        //audioChunks = JSON.parse(localStorage.getItem("audioChunks"));
        //audioChunks = audioChunksFromStorage;
        //const audioBlob = new Blob(audioChunks);
        //audioUrl = URL.createObjectURL(audioBlob);
        //audioRecord = new Audio(audioUrl);
        $("#audio").attr('src', audioUrl);
        //audioRecord = localStorage.getItem("audioRecord");
        // mediaRecorder = JSON.parse(localStorage.getItem("mediaRecorder"));
        showPlaySessionButton();
    }

    for(i=0; i<squaresArray.length; i++) {
        let squareId = "square" + (i+1).toString();
        let element = document.getElementById(squareId);

        if(squaresArray[i] === 1) {
            element.childNodes[0].nodeValue = "On";
            element.classList.add("clicked_square");
        }
        else
        {
            element.childNodes[0].nodeValue = "Off";
            element.classList.remove("clicked_square");
        }
    }
}