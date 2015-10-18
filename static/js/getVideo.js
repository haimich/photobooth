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
      var sliderHue = document.querySelector('input[name=hue]'),
          sliderDelta1 = document.querySelector('input[name=delta1]'),
          sliderDelta2 = document.querySelector('input[name=delta2]'),
          sliderDelta3 = document.querySelector('input[name=delta3]'),
          sliderMaxLight = document.querySelector('input[name=maxlight]'),
          sliderMinLight = document.querySelector('input[name=minlight]'),
          sliderMinSaturation = document.querySelector('input[name=minSaturation]');

      return {
        input: mergeCanvas,
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
        mergeCtx.drawImage(video, 0, 0, video.clientWidth,    video.clientHeight,
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

//chromaCtx.clearRect(0, 0, chromaCanvas.width, chromaCanvas.height);
chromaCtx.drawImage(bgImg, 0, 0, bgImg.naturalWidth,    bgImg.naturalHeight,
                   0, 0, chromaCanvas.width, chromaCanvas.height);

      fillChromaCanvas();
      setTimeout(function () {
        timerCallback();
      }, 0);
    }

    function loadImage(sourceURL) {
      return new Promise(function (resolve, reject) {
        var imageElement = document.createElement('img');
        imageElement.crossorigin = 'anonymous';
        imageElement.src = sourceURL;
        imageElement.onload = function () { resolve(imageElement); };
        imageElement.onerror = reject;
      });
    }

loadImage('https://farm1.staticflickr.com/592/22266513761_3d92f74958_h.jpg').then(function (img) { bgImg = img; console.log(img); });

    function snapshot() {
      //1. Add background image
      //mergeCtx.drawImage(bgImg, 0, 0, bgImg.naturalWidth, bgImg.naturalHeight);

      //2. Add current video image with chroma key applied
      //mergeCtx.drawImage(chromaCanvas, 0, 0);

      snapshotElement.src = chromaCanvas.toDataURL();
    }

    chromaCanvas.addEventListener('click', snapshot);
    video.addEventListener('play', function() {
      // var width = video.videoWidth / 2;
      // var height = video.videoHeight / 2;
      timerCallback();
    });

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