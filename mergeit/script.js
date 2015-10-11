(function () {
  'use strict';

  var c = document.querySelector("#myCanvas");
  var ctx = c.getContext("2d");
  var img1 = document.querySelector("#img1");
  var img2 = document.querySelector("#img2");

  ctx.drawImage(img1, 0, 0, img1.width, img1.height,        // source rectangle
                      0, 0, c.width, c.height); // destination rectangle
  ctx.drawImage(img2, 0, 0, img2.width, img2.height,        // source rectangle
                      0, 0, c.width, c.height); // destination rectangle


  // var imageObj = new Image();
  // var imageObj2 = new Image();
  // imageObj1.src = "1.png";

  // imageObj1.onload = function() {
  //    ctx.drawImage(imageObj1, 0, 0, 328, 526);
  //    imageObj2.src = "2.png";
  //    imageObj2.onload = function() {
  //       ctx.drawImage(imageObj2, 15, 85, 300, 300);
  //       var img = c.toDataURL("image/png");
  //       document.write('<img src="' + img + '" width="328" height="526"/>');
  //    };
  // };

}());