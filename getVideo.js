(function () {
  'use strict';
  
  var video = document.querySelector('#videoElement');
  var canvas = document.querySelector('#canvasElement');
  var img = document.querySelector('#imgElement');

  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0, img.width, img.height,        // source rectangle
                           0, 0, canvas.width, canvas.height); // destination rectangle
      
      // "image/webp" works in Chrome. Other browsers will fall back to image/png.
      img.src = canvas.toDataURL('image/webp');
    }
  }

  video.addEventListener('click', snapshot, false);

  function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }
  
  function videoError(e) {
    console.log('An error occured: ', e);
  }
   
  if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
}());