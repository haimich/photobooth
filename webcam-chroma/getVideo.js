(function () {
  'use strict';

  var video = document.querySelector('#videoElement');
  var canvas = document.querySelector('#canvasElement');
  var ctx = canvas.getContext('2d');

  var localMediaStream = null;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  function buildConfig() {
    var sliderHue = document.querySelector('input[name=hue]'),
        sliderDelta1 = document.querySelector('input[name=delta1]'),
        sliderDelta2 = document.querySelector('input[name=delta2]'),
        sliderDelta3 = document.querySelector('input[name=delta3]'),
        sliderMaxLight = document.querySelector('input[name=maxlight]'),
        sliderMinLight = document.querySelector('input[name=minlight]'),
        sliderMinSaturation = document.querySelector('input[name=minSaturation]');

    return {
      input: canvas,
      hueKey: sliderHue.value,
      hueDelta1: sliderDelta1.value,
      hueDelta2: sliderDelta2.value,
      hueDelta3: sliderDelta3.value,
      maxLight: sliderMaxLight.value / 100,
      minLight: sliderMinLight.value / 100,
      minSatur: sliderMinSaturation.value / 100
    };
  }

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0, 300, 200);
      
      var alpha = new window.ChromaKey2Alpha(buildConfig());
      alpha.removeChromaKey();
    }
  }

  function timerCallback() {
    if (video.paused || video.ended) {
      return;
    }

    snapshot();
    setTimeout(function () {
      timerCallback();
    }, 0);
  }

  video.addEventListener('click', snapshot, false);
  video.addEventListener('play', function() {
    // var width = video.videoWidth / 2;
    // var height = video.videoHeight / 2;
    timerCallback();
  }, false);

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