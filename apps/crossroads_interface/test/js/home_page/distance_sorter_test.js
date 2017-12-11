import DistanceSorter from '../../../web/static/js/home_page/distance_sorter';

/* global CRDS */

describe('DistanceSorter', () => {
  const cardCarouselDom = `<div id="locations-search" data-automation-id="locations-search" class="clearfix">
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
    <div class="card-deck carousel" data-carousel="mobile-scroll" data-carousel-id="carousel-a1kj76" data-filter-reset-label="All Locations">
      <div class="feature-cards card-deck--expanded-layout" data-carousel="mobile-scroll" id="section-locations">
        <div class="card" data-filter="Central Kentucky" data-location="Andover">
          <a class="block" href="/andover/"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase"><a href="/andover/">Andover</a></h4>
            <div class="card-text">
              <p>4128 Todds Rd.<br>
              Lexington, KY 40509 (<a href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174" target="_blank">Map</a>)</p>
              <p><strong>Service Times:</strong><br>
              SUN: 9:15 &amp; 11:00am</p>
            </div>
          </div>
        </div>
        <div class="card" data-filter="Central Ohio" data-location="Columbus">
          <a class="block" href="https://www.crossroads.net/columbus/"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/columbus/">Columbus</a></h4>
            <div class="card-text">
              <p><a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a></p>
            </div>
          </div>
        </div>
        <div class="card" data-filter="" data-location="Anywhere">
          <a class="block" href="https://www.crossroads.net/anywhere"><img alt="Anywhere" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/IMG-5910.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/IMG-5910.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
          <div class="card-block">
            <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/anywhere">Anywhere</a></h4>
            <div class="card-text">
              <p>Experience Crossroads via live stream anywhere in the world.</p>
              <p><strong>Service Times (EST):</strong></p>
              <p>SAT: 4:30 &amp; 6:00 PM<br>
              SUN: 9:15 AM, 11:00 AM, 12:30 AM</p>
            </div>
          </div>
        </div>
    </div>
  </div>`;


  let distanceSorter;
  let carousels;

  const apiResponse1 = [
    {
      origin: '45243',
      location: {
        locationId: 19,
        location: 'Andover',
        address: '4128 TODDS RD',
        city: 'LEXINGTON',
        state: 'KY',
        zip: '40509-9440',
        imageUrl: '//crds-cms-uploads.imgix.net/content/images/andover-sq.jpg'
      },
      distance: 40
    },
    {
      origin: '45243',
      location: {
        locationId: 21,
        location: 'Columbus',
        address: '150 West Main Street',
        city: 'New Albany',
        state: 'OH',
        zip: '43054',
        imageUrl: null
      },
      distance: 50
    },
  ];

  const apiResponse2 = [
    {
      origin: '45243',
      location: {
        locationId: 19,
        location: 'Andover',
        address: '4128 TODDS RD',
        city: 'LEXINGTON',
        state: 'KY',
        zip: '40509-9440',
        imageUrl: '//crds-cms-uploads.imgix.net/content/images/andover-sq.jpg'
      },
      distance: 85
    },
    {
      origin: '45243',
      location: {
        locationId: 21,
        location: 'Columbus',
        address: '150 West Main Street',
        city: 'New Albany',
        state: 'OH',
        zip: '43054',
        imageUrl: null
      },
      distance: 60
    },
  ];

  const errorResponse = {
    message: 'LocationController: GET locations proximities -- ',
    errors: [
      "Exception of type 'crds_angular.Exceptions.InvalidAddressException' was thrown."
    ]
  };

  beforeEach(() => {
    document.body.innerHTML = cardCarouselDom;
    document.getElementsByTagName('input')[0].value = '45243';
    carousels = new CRDS.CardCarousels();
    distanceSorter = new CRDS.DistanceSorter();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    CRDS._instances = {};
  });

  it('gets the user input from the form', () => {
    expect(distanceSorter.searchInput.value).toEqual('45243');
  });

  it('calls the API backend when the submit event listener is triggered', () => {
    spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValue($.Deferred().resolve(apiResponse1).promise());
    distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
    expect(distanceSorter.locationFinder.getLocationDistances).toHaveBeenCalledWith('45243');
  });

  it('gets the locations carousel from CRDS._instances', () => {
    expect(distanceSorter.locationsCarousel.carousel.id).toEqual('section-locations');
  });

  it('displays the Anywhere location card first when user is greater than 30 miles from nearest location', () => {
    spyOn(distanceSorter, 'getDistance').and.returnValue($.Deferred().resolve(apiResponse1).promise());
    distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
    const firstCard = document.getElementsByClassName('card')[0];
    expect(firstCard.innerText).toContain('Anywhere');
  });

  describe('displays error messages when a user submits invalid input', () => {
    it('and if an old error is not already displayed, the error message appears before the location carousel', () => {
      spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValue($.Deferred().reject(errorResponse).promise());
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      expect(document.body.innerText).toContain('We couldn\'t find what you were looking for. Try searching again.');
    });

    it('and if an older error is already displayed, the new error replaces the old', () => {
      spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValues($.Deferred().reject(errorResponse).promise(), $.Deferred().reject(errorResponse).promise());
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      const errorMessages = document.getElementsByClassName('error-text alert alert-danger');
      expect(errorMessages.length).toEqual(1);
    });

    it('if a subsequent valid search is conducted, the error message gets cleared from the DOM', () => {
      spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValues($.Deferred().reject(errorResponse).promise(), $.Deferred().resolve(apiResponse1).promise());
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      const errorMessages = document.getElementsByClassName('error-text alert alert-danger');
      expect(errorMessages.length).toEqual(0);
    });
  });

  describe('displays distances when a user submits input', () => {
    it('if a match is found between the API locationDistance data and a DOM location card', () => {
      spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValue($.Deferred().resolve(apiResponse1).promise());
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      const labels = document.getElementsByClassName('distance label');
      expect(labels.length).toEqual(2);
      expect(labels[0].innerText).toEqual('40 miles');
    });

    it('and if it is a subsequent successful submission, replaces the existing distances with new ones', () => {
      spyOn(distanceSorter.locationFinder, 'getLocationDistances').and.returnValues($.Deferred().resolve(apiResponse1).promise(), $.Deferred().resolve(apiResponse2).promise());
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      distanceSorter.handleFormSubmit({ preventDefault() { return {}; } });
      const labels = document.getElementsByClassName('distance label');
      expect(labels.length).toEqual(2);
      expect(labels[0].innerText).toEqual('60 miles');
    });
  });
});
