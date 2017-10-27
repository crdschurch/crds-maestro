import LocationFinder from '../../../web/static/js/home_page/location_finder';

/* global CRDS */

describe('LocationFinder', () => {
  let locationFinder;

  beforeEach(() => {
    window.env.gatewayServerEndpoint = 'https://gateway.crossroads.net/gateway/';
  });

  it('makes a call to MP with the proper arguments', () => {
    spyOn($, 'ajax');
    locationFinder = new CRDS.LocationFinder();
    locationFinder.getLocationDistances('45243');

    expect($.ajax).toHaveBeenCalledWith({
      url: `${window.env.gatewayServerEndpoint}api/v1.0.0/locations/proximities`,
      dataType: 'json',
      crossDomain: true,
      data: {
        origin: '45243'
      }
    });
  });
});
