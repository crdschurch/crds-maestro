/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  constructor(origin) {
    this.gatewayAPIEndpoint = 'https://int.crossroads.net/proxy/api/gateway';
    this.origin = origin;
    this.distancesFromOrigin = [];
    this.setup();
  }

  setup() {
    const locationDistances = this.getLocationDistances();
    for (let i = 0; i < locationDistances.length; i++) {
      const locationName = locationDistances[i].location.location;
      const distance = locationDistances[i].distance;
      const locationDistance = { location: locationName, distance: distance };
      this.distancesFromOrigin.push(locationDistance);
    }
  }

  getLocationDistances() {
    const locationDistancesURL = `${this.gatewayAPIEndpoint}/locations/proximities`;
    return $.ajax({
      url: locationDistancesURL,
      dataType: 'json',
      crossDomain: true,
      data: {
        origin: this.origin
      },
      success: (data) => { return data; },
      error: () => { console.log('There was an error retrieving distances to Crossroads churches.'); }
    });
  }

  static getLocationCards() {
    const locationSection = document.getElementById('section-locations');
    return locationSection.querySelectorAll('.card');
  }
};
 