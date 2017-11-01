import DistanceSorter from '../../../web/static/js/home_page/distance_sorter';

/* global CRDS */

describe('DistanceSorter', () => {
  const testDom = `<section class="container ng-scope" ng-non-bindable="">
  <div id="locations-search" data-automation-id="locations-search" class="clearfix">
    <h3 class="collection-header">locations</h3>
    <form class="searchbar" id="locations-address-input">
      <div class="input-group">
        <input class="form-control" placeholder="Search by address or zip code" type="text">
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="submit">
            <svg class="icon icon-1" viewBox="0 0 256 256">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#search"></use>
            </svg>
          </button>
        </span>
      </div>
    </form>
  </div>
  <div class="card-deck carousel" data-carousel="mobile-scroll" data-filter-reset-label="All Locations" data-carousel-id="carousel-h1qe9a">
    <div id="section-locations" class="feature-cards card-deck--expanded-layout" data-carousel="mobile-scroll">
      <div class="card" data-filter="Central Kentucky">
        <a href="/andover/" class="block"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase">
            <a href="/andover/">Andover</a>
          </h4>
          <div class="card-text">
            <p>4128 Todds Rd.<br>Lexington, KY 40509 (<a target="_blank" href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174">Map</a>)</p>
            <p><strong>Service Times:</strong><br>SUN: 9:15 &amp; 11:00am</p>
          </div>
        </div>
      </div>
      <div class="card" data-filter="Central Ohio">
        <a href="https://www.crossroads.net/columbus/" class="block"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase">
            <a href="https://www.crossroads.net/columbus/">Columbus</a>
          </h4>
          <div class="card-text">
            <p><a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a></p>
          </div>
        </div>
      </div>
      <div class="card" data-filter="">
        <a href="https://www.crossroads.net/anywhere" class="block"><img alt="Anywhere" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/IMG-5910.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/IMG-5910.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase">
            <a href="https://www.crossroads.net/anywhere">Anywhere</a>
          </h4>
          <div class="card-text">
            <p>Experience Crossroads via live stream anywhere in the world.</p>
            <p><strong>Service Times (EST):</strong></p>
            <p>SAT: 4:30 &amp; 6:00 PM<br>SUN: 9:15 AM, 11:00 AM, 12:30 AM</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

  let distanceSorter;
  let domCards = {cards:[]};

  beforeEach(() => {
    document.body.innerHTML = testDom;
    document.getElementsByTagName('input')[0].value = '45243';
    domCards.cards = document.getElementsByClassName('card');
    spyOn(CRDS.DistanceSorter, 'getLocationsCarousel').and.returnValue(domCards);
    distanceSorter = new CRDS.DistanceSorter();
  });

  it('gets the user input from the form', () => {
    expect(distanceSorter.searchInput.value).toEqual('45243');
  });

  it('calls the API backend when the submit event listener is triggered', () => {
    spyOn(locationFinder, 'getLocationDistances');
    $('.btn .btn-secondary').click();
    expect(CRDS.LocationFinder.getLocationDistances).not.toHaveBeenCalled();
  });

  it('displays the Anywhere location card first when user is greater than 30 miles from nearest location', () => {

  });

  describe('displays error messages when a user submits invalid input', () => {
    it('and if an old error is not already displayed, the error message appears before the location carousel');
    it('and if an olde error is already displayed, the new error replaces the old');
    it('and if a subsequent valid search is conducted, the error message gets cleared from the DOM');
  });

  describe('displays distances when a user submits input', () => {
    it('if a match is found between the API locationDistance data and a DOM location card');
    it('and if it is an initial submission, adds the distances to the DOM');
    it('and if it is a subsequent submission, replaces the existing distances with new ones');
  });
});
