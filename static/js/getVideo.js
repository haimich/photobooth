(function () {
  'use strict';

  window.onload = function() {

    var video = document.querySelector('#videoElement');
    var bgImg = document.querySelector('#bg-img');

    var chromaCanvas = document.querySelector('#chromaCanvas');
    var mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = chromaCanvas.width;
    mergeCanvas.height = chromaCanvas.height;
    var chromaCtx = chromaCanvas.getContext('2d');
    var mergeCtx = mergeCanvas.getContext('2d');
    var snapshotElement = document.querySelector('#snapshot');

    var localMediaStream = null;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    function buildConfig() {
      return {
        input: mergeCanvas,
        hueKey: document.querySelector('input[name=hue]').value,
        hueDelta1: document.querySelector('input[name=delta1]').value,
        hueDelta2: document.querySelector('input[name=delta2]').value,
        hueDelta3: document.querySelector('input[name=delta3]').value,
        maxLight: document.querySelector('input[name=maxlight]').value / 100,
        minLight: document.querySelector('input[name=minlight]').value / 100,
        minSatur: document.querySelector('input[name=minSaturation]').value / 100
      };
    }

    function fillChromaCanvas() {
      if (localMediaStream) {
        mergeCtx.drawImage(video, 0, 0, 640, 480, //video.clientWidth,    video.clientHeight,
                   0, 0, chromaCanvas.width, chromaCanvas.height);
        
        var chromaKeyer = new window.ChromaKey2Alpha(buildConfig());
        chromaKeyer.removeChromaKey();
        chromaCtx.drawImage(mergeCanvas, 0, 0);
      }
    }

    function timerCallback() {
      if (video.paused || video.ended) {
        return;
      }

      var offsetY = (bgImg.naturalWidth / 4 * 3 - bgImg.naturalHeight) / 2;

      chromaCtx.clearRect(0, 0, chromaCanvas.width, chromaCanvas.height);
      chromaCtx.drawImage(bgImg, 0, 0, bgImg.naturalWidth,    bgImg.naturalHeight,
                         0, 0, chromaCanvas.width, chromaCanvas.height);

      fillChromaCanvas();
      setTimeout(function () {
        timerCallback();
      }, 10);
    }

    video.addEventListener('play', function() { timerCallback(); });

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