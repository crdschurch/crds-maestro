import LocationFinder from '../../../web/static/js/home_page/location_finder';

/* global CRDS */

describe('LocationFinder', () => {

  const locationsTestDom = `<div id="section-locations" class="feature-cards flickity-enabled is-draggable" data-carousel="mobile-scroll" tabindex="0">
    <div class="flickity-viewport" style="height: 481px; touch-action: none;">
      <div class="flickity-slider" style="left: 0px; transform: translateX(-570.65%);">
        <div class="card carousel-cell" data-filter="Central Kentucky" style="position: absolute; left: 0%;">
          <a href="/andover/" class="block">
            <img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"
            src="https://crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
          </a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase">
              <a href="/andover/">Andover</a>
            </h4>
            <div class="card-text">
              <p>4128 Todds Rd.
                <br>Lexington, KY 40509 (
                                <a target="_blank" href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174">Map</a>)</p>
              <p>
                <strong>Service Times:</strong>
                <br>SUN: 9:15 &amp; 11:00am</p>
            </div>
          </div>
        </div>
        <div class="card carousel-cell" data-filter="Central Ohio" style="position: absolute; left: 51.81%;">
          <a href="https://www.crossroads.net/columbus/" class="block">
            <img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"
            src="https://crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
          </a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase">
              <a href="https://www.crossroads.net/columbus/">Columbus</a>
            </h4>
            <div class="card-text">
              <p>
                <a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a>
              </p>
            </div>
          </div>
        </div>
        <div class="card carousel-cell" data-filter="Northern Ohio" style="position: absolute; left: 103.62%;">
          <a href="https://www.crossroads.net/cleveland/" class="block">
            <img alt="Cleveland" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"
            src="https://crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
          </a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase">
              <a href="https://www.crossroads.net/cleveland/">Cleveland</a>
            </h4>
            <div class="card-text">
              <p>
                <a href="https://www.crossroads.net/cleveland/">Get more information on Crossroads Cleveland</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const apiReturnData = [
    {
      "origin": "45140",
      "location": {
              "locationId": 3,
              "location": "Oakley",
              "address": "3500 Madison Road",
              "city": "Cincinnati",
              "state": "OH",
              "zip": "45209",
              "imageUrl": "//crds-cms-uploads.imgix.net/content/images/site-oakley.jpg"
            },
      "distance": 17.9
    },
    {
      "origin": "45140",
      "location": {
              "locationId": 5,
              "location": "Mason",
              "address": "990 Reading Road Mason - Crossroads Mason Church",
              "city": "Mason",
              "state": "OH",
              "zip": "45040-8769",
              "imageUrl": "//crds-cms-uploads.imgix.net/content/images/site-mason.jpg"
            },
      "distance": 14.4
    }
  ]

  let locationFinder;

  beforeEach(() => {
    document.body.innerHTML = locationsTestDom;
    spyOn($, 'ajax').and.returnValue(apiReturnData);
    locationFinder = new CRDS.LocationFinder('45249'); 
  });

  it("on initialization, it creates an object of locations:distances", () => {
    const data = [{"location": "Oakley", "distance": 17.9}, {"location": "Mason", "distance": 14.4}]
    expect(locationFinder.distancesFromOrigin).toEqual(data);
  });

});
