(function() {
  vex.defaultOptions.className = 'vex-theme-flat-attack';
  var dialogBtn = document.querySelector('#bg-img');

  var $el = '<form id="searchthis" action="/search" style="display:inline;" method="get"><input id="search-box" name="q" size="40" type="text" placeholder="Search on Flickr"/><input id="search-btn" value="Search" type="submit"/></form>';

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