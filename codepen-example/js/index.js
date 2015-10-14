(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var isStreaming = false,
        v = document.getElementById('v'),
        c = document.getElementById('c'),
        btn = document.getElementById('btn'),
        con = c.getContext('2d'),
        slider = document.getElementById('slider'),
        w = 600, 
        h = 420,
        threshold = 1,
        snapshot = null,
        applyChromaKey = false;

		// Cross browser
		navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
		if (navigator.getUserMedia) {
			// Request access to video only
			navigator.getUserMedia(
				{
					video:true,
					audio:false
				},		
				function(stream) {
					// Cross browser checks
					var url = window.URL || window.webkitURL;
        			v.src = url ? url.createObjectURL(stream) : stream;
        			// Set the video to play
        			v.play();
				},
				function(error) {
					alert('Something went wrong. (error code ' + error.code + ')');
					return;
				}
			);
		}
		else {
			alert('Sorry, the browser you are using doesn\'t support getUserMedia');
			return;
		}

		// Wait until the video stream can play
		v.addEventListener('canplay', function(e) {
		    if (!isStreaming) {
		    	// videoWidth isn't always set correctly in all browsers
		    	if (v.videoWidth > 0) h = v.videoHeight / (v.videoWidth / w);
				c.setAttribute('width', w);
				c.setAttribute('height', h);
				// Reverse the canvas image
				con.translate(w, 0);
  				con.scale(-1, 1);
		      	isStreaming = true;
		    }
		}, false);

		// Wait for the video to start to play
		v.addEventListener('play', function() {
			// Every 33 milliseconds copy the video image to the canvas
			
            setInterval(function() {
				if (v.paused || v.ended) return;
				con.fillRect(0, 0, w, h);
				con.drawImage(v, 0, 0, w, h);
				if (applyChromaKey) chromaKey();
			}, 16);
          
		}, false);

		var chromaKey = function() {
          var currentImage = con.getImageData(0, 0, w, h);
		  var o = snapshot.data;
          
          var data = currentImage.data;
          
          for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            var a = 1;
            
            var _tMin = (1 - parseFloat(threshold));
            var _tMax = (1 + parseFloat(threshold));
            
            a = (r * _tMin > o[i]  || r * _tMax < o[i]) ? 255 : 0;
            a = (g * _tMin > o[i+1] || g * _tMax < o[i+1]) ? 255 : 0;
            a = (b * _tMin > o[i+2] || b * _tMax < o[i+2]) ? 255 : 0;
          
            data[i+3] = a;
            
          }
          con.putImageData(currentImage, 0, 0);
		}

		btn.addEventListener('click', function() {
        snapshot = con.getImageData(0, 0, w, h);
        applyChromaKey = !applyChromaKey;
        if (applyChromaKey) console.log('snapshot!');

      }, false);

      slider.addEventListener('input', function(){
        threshold = this.value;
      }, false);
		
	})
})();