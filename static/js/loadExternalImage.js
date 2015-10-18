
    function loadImage(src, onload) {
        // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
        var img = new Image();

        img.onload = onload;
        img.src = src;

        return img;
    }

    var img1 = loadImage('http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png', function() { ctx.drawImage(img1, 0, 0); });
