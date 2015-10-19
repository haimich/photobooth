(function () {
  'use strict';

  var shootBtn = document.querySelector('#shootBtn');
  var chromaCanvas = document.querySelector('#chromaCanvas');

  function uploadImage(imageAsBase64) {
    var url = '/upload';

    $.ajax({
      type: 'POST',
      url: url,
      data: { image: imageAsBase64 },
      success: function() {
        document.querySelector('#shareInONE').value = 'Success :)';
      },
      error: function(reason) { console.log('An error occured', reason); },
      dataType: 'json'
    });
  }

  function snapshot() {
    var snapshot = chromaCanvas.toDataURL('image/jpeg', 1.0);

    vex.open({
      message: null,
      showCloseButton: true,
      buttons: [],
      content: '<img src="' + snapshot + '"><div class="vex-dialog-buttons"><input id="shareInONE" class="vex-dialog-button-primary vex-dialog-button vex-first vex-last" value="Post in ONE!" type="submit"></div>'
    });

    //Set dialog width
    $('.vex.vex-theme-flat-attack .vex-content').css('width', '913px');

    document.querySelector('#shareInONE').addEventListener('click', function() {
      uploadImage(snapshot);
    });
  }

  shootBtn.addEventListener('click', snapshot);

  $('body').keydown(function(event) {
    if (event.which == 66) {
      snapshot();
    }
  });

}());