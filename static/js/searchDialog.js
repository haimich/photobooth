(function() {
  vex.defaultOptions.className = 'vex-theme-flat-attack';
  var dialogBtn = document.querySelector('#bg-img');

  var html = '<form id="imageSearchForm" action="/search" style="display:inline;" method="get"><input id="search-box" name="q" size="40" type="text" placeholder="Search on Flickr" autofocus/><input id="search-btn" value="Search" type="submit"/></form><div id="imageResults"></div>';

  dialogBtn.addEventListener('click', function() {
    vex.open({
      message: null,
      showCloseButton: true,
      buttons: [],
      afterOpen: function($vexContent) {
        addContent($vexContent);
      }
    });

    //Set dialog width
    $('.vex.vex-theme-flat-attack .vex-content').css('width', '856px');
  });

  function addContent($vexContent) {
    $vexContent.append(html);
    var form = document.querySelector('#imageSearchForm');
    var input = document.querySelector('#search-box');
    var imageResults = document.querySelector('#imageResults');

    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      var term = input.value;

      fetchPhotos(term)
        .then(function (photos) {
          var tmpElement = document.createDocumentFragment();
          photos.map(createImage).forEach(tmpElement.appendChild, tmpElement);

          imageResults.innerHTML = '';
          imageResults.appendChild(tmpElement);
        });
    });

    imageResults.addEventListener('click', function(evt) {
      var bgImg = document.querySelector('#bg-img');

      var largeImg = evt.target.src.replace('_q.jpg', '_b.jpg'); // see https://www.flickr.com/services/api/misc.urls.html

      bgImg.src = largeImg;
      vex.close();
    })
  }

  function fetchPhotos(term) {
    var url = '/search?term=' + term;

    return fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (res) { return res.photos.photo; });
  }

  function createImage(photo) {
    var photoUrl = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg';
    var proxyUrl = '/proxy?target=' + encodeURI(photoUrl);
    var imageElement = document.createElement('img');
    imageElement.src = proxyUrl;
    return imageElement;
  }
})();