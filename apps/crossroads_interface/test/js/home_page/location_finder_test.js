import LocationFinder from '../../../web/static/js/home_page/location_finder';

/* global CRDS */

fdescribe('LocationFinder', () => {
  it("runs a function", () => {
    let locationFinder = new CRDS.LocationFinder();
    expect(locationFinder.speak()).toEqual('foobar');
  });
});
