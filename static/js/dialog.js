(function() {
  vex.defaultOptions.className = 'vex-theme-flat-attack';
  var dialogBtn = document.querySelector('#bg-img');

  dialogBtn.addEventListener('click', function() {
    vex.dialog.open({
      message: null,
      content: '<div>Content</div>',
      showCloseButton: true,
      buttons: [],
      afterOpen: function($vexContent) {
        return $vexContent.append($el);
      },
      callback: function(value) {
        return console.log(value);
      }
    });
  });
})();