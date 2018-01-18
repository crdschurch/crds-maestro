/* eslist no-plusplus: 0 */
/* global CRDS analytics */

window.CRDS = window.CRDS || {};

CRDS.DataTracker = class DataTracker {
  constructor() {
    this.clickTrackable = undefined;
    this.searchTrackable = undefined;
    this.analytics = analytics;
    this.init();
  }

  init() {
    this.addClickListeners();
    this.addSearchListeners();
  }

  addClickListeners() {
    this.clickTrackable = document.querySelectorAll('[data-track-click]');
    for (let i = 0; i < this.clickTrackable.length; i += 1) {
      this.clickTrackable[i].addEventListener('click', this.handleClick.bind(this));
    }
  }

  addSearchListeners() {
    this.searchTrackable = document.querySelectorAll('[data-track-search]');
    for (let x = 0; x < this.searchTrackable.length; x += 1) {
      this.searchTrackable[x].addEventListener('submit', this.handleSearch.bind(this));
    }
  }

  handleClick(event) {
    const el = event.currentTarget;
    this.analytics.track('ElementClicked', {
      Name: el.dataset.trackClick || el.id || 'Unnamed Click Event',
      Target: el.outerHTML,
      Type: el.nodeName
    });
  }

  handleSearch(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const searchInput = form.getElementsByTagName('input')[0];
    this.analytics.track('SearchRequested', {
      Name: form.dataset.trackSearch || form.id || 'Unnamed Search',
      Target: form.outerHTML,
      SearchTerm: searchInput.value
    });
  }
};
