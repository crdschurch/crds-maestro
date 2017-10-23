/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  constructor() {
    this.myWord = 'foobar';
  }

  speak() {
    return this.myWord;
  }
};
