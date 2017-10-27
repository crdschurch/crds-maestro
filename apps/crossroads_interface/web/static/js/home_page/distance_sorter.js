/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.DistanceSorter = class DistanceSorter {
  constructor() {
    this.locationDistances = [];
    this.searchForm = undefined;
    this.searchInput = undefined;
    this.cards = undefined;
    this.init();
  }

  init() {
    this.searchForm = document.getElementById('locations-address-input');
    this.searchForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.searchInput = this.searchForm.getElementsByTagName('input')[0];
    this.locationsCarousel = DistanceSorter.getLocationsCarousel();
    this.cards = this.locationsCarousel.cards;
  }

  static getLocationsCarousel() {
    return Object.values(CRDS._instances).find(instance => instance.carousel !== undefined && instance.carousel.id === 'section-locations');
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.getDistance()
      .done((locationDistances) => {
        for (let i = 0; i < locationDistances.length; i += 1) {
          const locationName = locationDistances[i].location.location;
          const distance = locationDistances[i].distance;
          const locationDistance = { location: locationName, distance };
          this.locationDistances.push(locationDistance);
        }
        this.createDataAttributes();
        this.appendDistances();
        this.locationsCarousel.sortBy('distance');
        this.anywhereCheck();
        this.clearError();
      })
      .fail((xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        this.showError();
      });
  }

  getDistance() {
    this.locationDistances = [];
    const locationFinder = new CRDS.LocationFinder();
    return locationFinder.getLocationDistances(this.searchInput.value);
  }

  createDataAttributes() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const location = this.cards[i].getElementsByClassName('card-title')[0].children[0].textContent;
      this.cards[i].dataset.location = location;
    }
  }

  showError() {
    const errorText = document.createTextNode('We couldn\'t find what you were looking for. Try searching again.');
    const errorElement = document.createElement('div');
    const parent = this.locationsCarousel.carousel.parentElement;
    this.searchInput.classList.add('error');
    errorElement.classList.add('error-text', 'alert', 'alert-danger');
    errorElement.append(errorText);
    const oldError = parent.getElementsByClassName('error-text');
    if (oldError.length === 0) {
      parent.insertBefore(errorElement, this.locationsCarousel.carousel);
    } else {
      parent.replaceChild(errorElement, oldError[0]);
    }
  }

  clearError() {
    const errors = this.locationsCarousel.carousel.parentNode.getElementsByClassName('error-text');
    errors[0].parentElement.removeChild(errors[0]);
    this.searchInput.classList.remove('error');
  }

  anywhereCheck() {
    if (this.locationDistances[0].distance > 30) {
      this.cards[this.cards.length - 1].classList.add('order-first');
    } else {
      this.cards[this.cards.length - 1].classList.remove('order-first');
    }
  }

  appendDistances() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const locationMatch = this.locationDistances.find(obj => obj.location === this.cards[i].dataset.location);
      if (locationMatch !== undefined) {
        this.cards[i].dataset.distance = locationMatch.distance;
        const span = document.createElement('span');
        span.classList.add('distance', 'label', 'font-family-base');
        span.append(`${locationMatch.distance} miles`);
        const oldSpan = this.cards[i].getElementsByClassName('distance');
        if (oldSpan.length === 0) {
          this.cards[i].insertBefore(span, this.cards[i].children[0]);
        } else {
          this.cards[i].replaceChild(span, oldSpan[0]);
        }
      }
    }
  }
};
