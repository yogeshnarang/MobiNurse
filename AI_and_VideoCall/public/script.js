const socket = io('/')

const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer( {
    secure: true,
    port: '443',
    host: 'medimeet.herokuapp.com',
    path: "/peerjs"
})

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyB8cz2hXKJG7u-tRCtAkPyEQ5AqMXBY3Lc",
          authDomain: "imagetotextf.firebaseapp.com",
          databaseURL: "https://imagetotextf.firebaseio.com",
          projectId: "imagetotextf",
          storageBucket: "imagetotextf.appspot.com",
          messagingSenderId: "447880853522",
          appId: "1:447880853522:web:c9ebec7756f596c6f8c0cb"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        // connectToNewUser(userId, stream)
        setTimeout(() => {
            connectToNewUser(userId, stream)
        }, 1000)
    })
})

socket.on('user-disconnected', userId => {
    // console.log(userId);
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

socket.emit('join-room', ROOM_ID, 10)

socket.on("user-connected", userId => {
    console.log(userId);
})

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call 
}

URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
var fname;
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

function Rec() {
  //Record Button is Clicked
  console.log("Record Button Clicked!!");

  //Set the constraints to audio
  var constraints = { audio: true, video: false };
  
  $("#recordbtn").attr("disabled", true);
  $("#stopbtn").attr("disabled", false);

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log("Stream Created.. Initializing Recorder");

      //create an audio context
      audioContext = new AudioContext();
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);
      rec = new Recorder(input, { numChannels: 1 });
      rec.record();
      console.log("Recording Started Successfully!!");
    })
    .catch(function (err) {
      console.log("An error occured");
      $("#recordbtn").attr("disabled", false);
      $("#stopbtn").attr("disabled", true);
    });
}

function Stop() {
  console.log("Stop Button Clicked");
  $("#recordbtn").attr("disabled", false);
  $("#stopbtn").attr("disabled", true);
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    var my_url = URL.createObjectURL(blob);
    var f_name = new Date().toISOString();
    fname = f_name;
    $("#list").empty();
    $("#controls").append(
      $("<div>")
        .append( 
            $("<button>")
            .text("Upload")
            .attr("class", "btn btn-success uploadbtn")
            .on("click", function () {
              console.log("Upload Button Clicked");
              let storage = firebase
                .storage()
                .ref("Audio_New/" + f_name + ".wav");
              let task = storage.put(blob);
              task.then(function (snapshot) {
                console.log("Uploaded the file");
                storage
                  .getDownloadURL()
                  .then(function (url) {

                    $("#view-presc-link").removeClass("hidden")

                    var xhr = new XMLHttpRequest();
                    xhr.responseType = "blob";
                    xhr.onload = function (event) {
                      var blob = xhr.response;
                    };
                    xhr.open("GET", url);
                    xhr.send();
  
                    firebase.database().ref("FilePath").set({
                      URL: url,
                    });
                    console.log("URL has been set to " + url);
                    
                    let urll = "localhost:5000/jsonData";
          
              // open a connection
              // xhr.open("POST", urll, true);
    
              // Set the request header i.e. which type of content you are sending
              // xhr.setRequestHeader("Content-Type", "application/json");
    
              // Create a state change callback
              // xhr.onreadystatechange = function () {
              //     if (xhr.readyState === 4 && xhr.status === 200) {
    
              //         // Print received data from server
              //         // result.innerHTML = url;
    
              //     }
              // };
    
              // Converting JSON data to string
              // var data = JSON.stringify({ "url": url, 
              // "to1": "vishesh1999gupta@gmail.com", 
              // "to2": "yogesh.narang49@gmail.com"});
    
              // Sending data with the request
              // xhr.send(data);
                    // axios({
                    //   method: 'post',
                    //   url: 'locathost:3000/jsonData',
                    //   data: {
                    //     url : url,
                    //     to1: "vishesh1999gupta@gmail.com",
                    //     to2: "yogesh.narang49@gmail.com"
                    //   }
                    // });
                    axios.post("/jsonData",{
                      url: url,
                      to1: patientEmail,
                      to2: doctorEmail,
                      roomId: ROOM_ID
                    })
                    console.log("DONE!!");
                  })
                  .catch(function (err) {
                    console.log("Failure");
                  });
              });
            })
        )
    );
  }