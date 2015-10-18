(function() {
  vex.defaultOptions.className = 'vex-theme-flat-attack';
  var dialogBtn = document.querySelector('#bg-img');

  var $el = '<form id="imageSearchForm" action="/search" style="display:inline;" method="get"><input id="search-box" name="q" size="40" type="text" placeholder="Search on Flickr"/><input id="search-btn" value="Search" type="submit"/></form><div id="imageResults">results go here</div>';

  dialogBtn.addEventListener('click', function() {
    vex.dialog.open({
      message: null,
      content: '<div>Content</div>',
      showCloseButton: true,
      buttons: [],
      afterOpen: function($vexContent) {
        $vexContent.append($el);
        var form = document.querySelector('#imageSearchForm');
        var input = document.querySelector('#search-box');
        var imageResults = document.querySelector('#imageResults');

        form.addEventListener('submit', function(evt) {
          evt.preventDefault();
          var term = input.value;

          fetchPhotos(term);

          // fetchPhotos(term)
          //   .then(function (res) { debugger; return res.json(); })
          //   .then(function (res) { debugger; return res.photos.photo; })
          //   .then(function (photos) {
          //     debugger;
          //     var tmpElement = document.createDocumentFragment();
          //     photos.map(createImage).forEach(tmpElement.appendChild, tmpElement);

          //     imageResults.innerHTML = '';
          //     imageResults.appendChild(tmpElement);
          //   });
        })
      }
    });
  });

  function fetchPhotos(term) {
    var url = "/search?term=" + term;

    $.get(url, function(data) {
      debugger;
    });

    // return fetch(url);
        // .then(function (res) { return res.json(); })
        // .then(function (res) { return res.photos.photo; });
  }

  function createImage(photo) {
    var photoUrl = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
      var imageElement = document.createElement('img');
      imageElement.src = photoUrl;
      return imageElement;
  }
})();