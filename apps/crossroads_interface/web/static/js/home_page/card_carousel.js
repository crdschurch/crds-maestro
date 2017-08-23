window['CRDS'] = window['CRDS'] || {};

// ----------------------------------------------- #

CRDS.CardCarousels = function (selector = undefined) {
  CRDS._instances = CRDS._instances || {};
  var els = document.querySelectorAll(selector || '[data-carousel]');
  for (var i = 0; i < els.length; i++) {
    new CRDS.CardCarousel(els[i]);
  }
};

// ----------------------------------------------- #

CRDS.CardCarousel = function (el) {
  this.init(el);
  return;
};

CRDS.CardCarousel.prototype.constructor = CRDS.CardCarousel;

CRDS.CardCarousel.prototype.init = function (el) {
  var id = 'carousel-' + this.generateId();
  el.setAttribute('data-carousel-id', id);
  CRDS._instances[id] = this;

  this.carousel = el.querySelector('.feature-cards');
  if (this.carousel) {
    this.carousel.dataset.carousel = el.dataset.carousel;
    this.setup();
    this.addStyles();
    return this.addEvents();
  }
};

CRDS.CardCarousel.prototype.setup = function () {
  var cards = this.getCards();
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.add('carousel-cell');
  }
  var images = this.getImages();
  this._imagesLoadedFix(images, function () {
    window.dispatchEvent(new Event('resize'));
  });
};

CRDS.CardCarousel.prototype._imagesLoadedFix = function (images, callback) {
  images.forEach((img)=>{
    var attributeCheck = setInterval(function () {
      if (img.hasAttribute('src')) {
        clearInterval(attributeCheck);
        imagesLoaded(img, () => {
          callback();
        });
      }
    }, 100);
  });
}

CRDS.CardCarousel.prototype.generateId = function () {
  return Math.random().toString(36).substring(7);
};

CRDS.CardCarousel.prototype.getCards = function () {
  return this.carousel.querySelectorAll('.card');
};

CRDS.CardCarousel.prototype.getImages = function () {
  return this.carousel.querySelectorAll('img');
};

CRDS.CardCarousel.prototype.updateCardClass = function (action) {
  for (var card = 0; card < this.getCards().length; card++) {
    this.getCards()[card].classList[action]('carousel-cell');
  };
}

CRDS.CardCarousel.prototype.createCarousel = function () {
  this.flickity = new Flickity(this.carousel, {
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    imagesLoaded: true
  });
};

CRDS.CardCarousel.prototype.destroyCarousel = function () {
  this.carousel.classList.add('card-deck--expanded-layout');
  this.updateCardClass('remove');
  if (this.flickity) {
    this.flickity.destroy();
  }
};

CRDS.CardCarousel.prototype.reload = function () {
  if (this.flickity) {
    this.flickity.reloadCells();
    this.flickity.selectCell(0);
  }
};

CRDS.CardCarousel.prototype.addStyles = function () {
  var carousel_type = this.carousel.dataset.carousel;

  if (carousel_type === 'mobile-scroll') {
    if (window.matchMedia('(max-width: 769px)').matches) {
      this.carousel.classList.remove('card-deck--expanded-layout');
      this.updateCardClass('add');
      this.createCarousel();
    } else {
      this.destroyCarousel();
    }
  } else {
    this.createCarousel();
  }
};

CRDS.CardCarousel.prototype.addEvents = function () {
  var _this = this;
  ['load', 'resize'].forEach(function (eventName) {
    window.addEventListener(eventName, function () {
      _this.addStyles();
    }, false);
  });
};
