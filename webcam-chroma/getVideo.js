(function () {
  'use strict';

  window.onload = function() {

    var video = document.querySelector('#videoElement');
    var bgImg = document.querySelector('#bg-img');

    var chromaCanvas = document.querySelector('#chromaCanvas');
    var mergeCanvas = document.querySelector('#mergeCanvas');
    var chromaCtx = chromaCanvas.getContext('2d');
    var mergeCtx = mergeCanvas.getContext('2d');

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
        input: chromaCanvas,
        hueKey: sliderHue.value,
        hueDelta1: sliderDelta1.value,
        hueDelta2: sliderDelta2.value,
        hueDelta3: sliderDelta3.value,
        maxLight: sliderMaxLight.value / 100,
        minLight: sliderMinLight.value / 100,
        minSatur: sliderMinSaturation.value / 100
      };
    }

    function fillChromaCanvas() {
      if (localMediaStream) {
        chromaCtx.drawImage(video, 0, 0, 300, 200);
        
        var chromaKeyer = new window.ChromaKey2Alpha(buildConfig());
        chromaKeyer.removeChromaKey();
      }
    }

    function timerCallback() {
      if (video.paused || video.ended) {
        return;
      }

      fillChromaCanvas();
      setTimeout(function () {
        timerCallback();
      }, 0);
    }

    function snapshot() {
      //1. Add background image
      mergeCtx.drawImage(bgImg, 0, 0, bgImg.naturalWidth, bgImg.naturalHeight);

      //2. Add current video image with chroma key applied

      mergeCtx.drawImage(chromaCanvas, 0, 0);
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
  };
}());