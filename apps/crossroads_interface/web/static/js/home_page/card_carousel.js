import imgixImagesLoaded from '../imgixImagesLoaded';

window.CRDS = window.CRDS || {};

/* global CRDS Flickity */

// ----------------------------------------------- #

CRDS.CardCarousels = class CardCarousels {
  constructor(selector = undefined) {
    CRDS._instances = CRDS._instances || {};
    this.carousels = [];
    const els = document.querySelectorAll(selector || '[data-carousel]');
    for (let i = 0; i < els.length; i += 1) {
      this.carousels[i] = new CRDS.CardCarousel(els[i]);
    }
  }
};

// ----------------------------------------------- #

CRDS.CardCarousel = class CardCarousel {
  constructor(el) {
    this.init(el);
  }

  init(el) {
    const id = `carousel-${CardCarousel.generateId()}`;
    el.setAttribute('data-carousel-id', id);
    CRDS._instances[id] = this;

    this.carousel = el.querySelector('.feature-cards');
    if (this.carousel) {
      this.carousel.dataset.carousel = el.dataset.carousel;
      this.setup();
      this.addStyles();
      this.addEvents();
    }
  }

  setup() {
    this.cards = this.getCards();
    for (let i = 0; i < this.cards.length; i += 1) {
      this.cards[i].classList.add('carousel-cell');
      this.cards[i].id = CardCarousel.generateId();
      // console.log(`Carousel ${this.carousel.id} card ${i} ${this.cards[i].id}`);
    }
    this.fixImages();
  }

  fixImages() {
    const images = this.getImages();
    imgixImagesLoaded(images, () => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  static generateId() {
    return Math.random().toString(36).substring(7);
  }

  getCards() {
    return this.carousel.querySelectorAll('.card');
  }

  getImages() {
    return this.carousel.querySelectorAll('img');
  }

  updateCardClass(action) {
    for (let card = 0; card < this.getCards().length; card += 1) {
      this.getCards()[card].classList[action]('carousel-cell');
    }
  }

  createCarousel() {
    this.flickity = new Flickity(this.carousel, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true
    });
  }

  destroyCarousel() {
    this.carousel.classList.add('card-deck--expanded-layout');
    this.updateCardClass('remove');
    if (this.flickity) {
      this.flickity.destroy();
    }
  }

  reload() {
    if (this.flickity) {
      this.flickity.reloadCells();
      this.flickity.selectCell(0);
    }
    this.fixImages();
  }

  addStyles() {
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
  }

  addEvents() {
    const _this = this;
    ['load', 'resize'].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        _this.addStyles();
      }, false);
    });
  }

  sortBy(criterion) {
    let order = 1;
    // `{criterion}` means sort by ascending.
    // `-{criterion}` means sort by descending.
    let criterionField = criterion;
    if (criterion[0] === '-') {
      criterionField = criterion.substr(1);
      order = -1;
    }
    Array.from(this.cards).sort((a, b) => {
      let aValue = parseFloat(a.dataset[criterionField], 10);
      let bValue = parseFloat(b.dataset[criterionField], 10);
      if (isNaN(aValue)) {
        aValue = a.dataset[criterionField];
      }
      if (isNaN(bValue)) {
        bValue = b.dataset[criterionField];
      }
      if (bValue == null || aValue < bValue) {
        return -1 * order;
      }
      if (aValue == null || aValue > bValue) {
        return 1 * order;
      }
      return 0;
    }).forEach((card, idx) => {
      // Update the visual position by changing the flexbox `order`.
      // Find which element this card is
      const cardElem = document.getElementById(card.id);
      ['order', 'webkitOrder', 'msFlexOrder', 'mozBoxOrdinalGroup', 'webkitBoxOrdinalGroup'].some((value) => {
        if (value in cardElem.style) {
          cardElem.style[value] = idx + 1;
        }
        return cardElem.style[value];
      });
    });
  }
};