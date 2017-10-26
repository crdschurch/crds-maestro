/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  constructor() {
    this.gatewayAPIEndpoint = `${window.env.gatewayServerEndpoint}/api/v1.0.0`;
    // this.origin = origin;
    this.distancesFromOrigin = [];
    // this.setup();
  }

  setup() {
    this.getLocationDistances()
      .done((locationDistances) => {
        for (let i = 0; i < locationDistances.length; i++) {
          const locationName = locationDistances[i].location.location;
          const distance = locationDistances[i].distance;
          const locationDistance = { location: locationName, distance: distance };
          this.distancesFromOrigin.push(locationDistance);
        }
      })
      .fail((xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
      });
  }

  getLocationDistances(origin) {
    const locationDistancesURL = `${this.gatewayAPIEndpoint}/locations/proximities`;
    return $.ajax({
      url: locationDistancesURL,
      dataType: 'json',
      crossDomain: true,
      data: {
        origin
      }
    });
  }

  static getLocationCards() {
    const locationSection = document.getElementById('section-locations');
    return locationSection.querySelectorAll('.card');
  }
};
