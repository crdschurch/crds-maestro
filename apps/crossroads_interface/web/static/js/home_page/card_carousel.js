window['CRDS'] = window['CRDS'] || {};

CRDS.CardCarousel = function(elementId) {
  this.init(elementId);
  return;
}

CRDS.CardCarousel.prototype.constructor = CRDS.CardCarousel;

CRDS.CardCarousel.prototype.init = function(elementId) {
  var _this = this;
  this.carousel = document.getElementById(elementId);
  if (!this.carousel) {
    setTimeout(_this.init, 100);
    return;
  }
  return this.addEvents();
};

CRDS.CardCarousel.prototype.getCards = function() {
  return this.carousel.querySelectorAll('.card');
};

CRDS.CardCarousel.prototype.updateCardClass = function(action) {
  for (var card = 0; card < this.getCards().length; card++) {
    this.getCards()[card].classList[action]('carousel-cell');
  };
}

CRDS.CardCarousel.prototype.createCarousel = function() {
  new Flickity(this.carousel, {
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots: false
  });
};

CRDS.CardCarousel.prototype.destroyCarousel = function() {
  this.carousel.classList.add('card-deck--expanded-layout');
  this.updateCardClass('remove');
  new Flickity(this.carousel).destroy();
};

CRDS.CardCarousel.prototype.addStyles = function() {
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

CRDS.CardCarousel.prototype.addEvents = function() {
  var _this = this;
  ['load', 'resize'].forEach(function(eventName) {
    window.addEventListener(eventName, function() {
      _this.addStyles();
    }, false);
  });
};
