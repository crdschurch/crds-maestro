import imgixImagesLoaded from '../imgixImagesLoaded';

window.CRDS = window.CRDS || {};

/* global CRDS Flickity */

// ----------------------------------------------- #

CRDS.CardCarousels = function CardCarousels(selector = undefined) {
  CRDS._instances = CRDS._instances || {};
  this.carousels = [];
  const els = document.querySelectorAll(selector || '[data-carousel]');
  for (let i = 0; i < els.length; i += 1) {
    this.carousels[i] = new CRDS.CardCarousel(els[i]);
  }
};

// ----------------------------------------------- #

CRDS.CardCarousel = function CardCarousel(el) {
  this.init(el);
};

CRDS.CardCarousel.prototype.constructor = CRDS.CardCarousel;

CRDS.CardCarousel.prototype.init = function init(el) {
  const id = `carousel-${this.generateId()}`;
  el.setAttribute('data-carousel-id', id);
  CRDS._instances[id] = this;

  this.carousel = el.querySelector('.feature-cards');
  if (this.carousel) {
    this.carousel.dataset.carousel = el.dataset.carousel;
    this.setup();
    this.addStyles();
    this.addEvents();
  }
};

CRDS.CardCarousel.prototype.setup = function setup() {
  const cards = this.getCards();
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].classList.add('carousel-cell');
  }
  const images = this.getImages();
  imgixImagesLoaded(images, () => {
    window.dispatchEvent(new Event('resize'));
  });
};

CRDS.CardCarousel.prototype.generateId = function generateId() {
  return Math.random().toString(36).substring(7);
};

CRDS.CardCarousel.prototype.getCards = function getCards() {
  return this.carousel.querySelectorAll('.card');
};

CRDS.CardCarousel.prototype.getImages = function getImages() {
  return this.carousel.querySelectorAll('img');
};

CRDS.CardCarousel.prototype.updateCardClass = function updateCardClass(action) {
  for (let card = 0; card < this.getCards().length; card += 1) {
    this.getCards()[card].classList[action]('carousel-cell');
  }
};

CRDS.CardCarousel.prototype.createCarousel = function createCarousel() {
  this.flickity = new Flickity(this.carousel, {
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    imagesLoaded: true
  });
};

CRDS.CardCarousel.prototype.destroyCarousel = function destroyCarousel() {
  this.carousel.classList.add('card-deck--expanded-layout');
  this.updateCardClass('remove');
  if (this.flickity) {
    this.flickity.destroy();
  }
};

CRDS.CardCarousel.prototype.reload = function reload() {
  if (this.flickity) {
    this.flickity.reloadCells();
    this.flickity.selectCell(0);
  }
};

CRDS.CardCarousel.prototype.addStyles = function addStyles() {
  const carouselType = this.carousel.dataset.carousel;

  if (carouselType === 'mobile-scroll') {
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

CRDS.CardCarousel.prototype.addEvents = function addEvents() {
  const _this = this;
  ['load', 'resize'].forEach((eventName) => {
    window.addEventListener(eventName, () => {
      _this.addStyles();
    }, false);
  });
};
