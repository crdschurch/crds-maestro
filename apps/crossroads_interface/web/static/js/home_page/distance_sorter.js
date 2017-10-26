/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.DistanceSorter = class DistanceSorter {
  constructor() {
    this.locationDistances = undefined;
    this.searchForm = document.getElementById('locations-address-input');
    this.searchInput = this.searchForm.getElementsByTagName('input')[0];
    this.cards = document.getElementById('locations-search').getElementsByClassName('card');
    this.searchForm.addEventListener('submit', this.handleFormSubmit);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    CRDS.DistanceSorter.getDistance();
    this.createDataAttributes();
    this.appendDistances();
  }

  static getDistance() {
    const locationFinder = new CRDS.LocationFinder(this.searchInput.value);
    this.locationDistances = locationFinder.distancesFromOrigin;
  }

  createDataAttributes() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const location = this.cards[i].getElementsByClassName('card-title')[0].children[0].textContent;
      this.cards[i].dataset.location = location;
    }
  }

  appendDistances() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const locationMatch = this.locationDistances.find(obj => obj.location === this.cards[i].dataset.location);
      const span = document.createElement('span');
      span.classList.add('distance');
      span.append(locationMatch.distance);
      this.cards[i].getElementsByClassName('card-block')[0].appendChild(span);
    }
  }
};
