import { CardFilters, CardFilter } from '../../../web/static/js/home_page/card_filters';


describe("CardFilters", () => {
  describe("new CardFilters()", () => {
    it("adds a mustache script tag if the DOM does not have a Mustache object defined", () => {
      new CRDS.CardFilters();
      let mustache_url = 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js';
      let element_src = document.getElementsByTagName('script')[0].src;
      expect(element_src).toEqual(mustache_url);
    });
  });
});

describe("CardFilter", () => {

  beforeEach(() => {
    let test_dom = `<section class="container" ng-non-bindable="">
      <h3 id="locations-filter-label" class="collection-header clearfix">locations</h3>
      
      <div class="card-deck carousel" data-carousel="mobile-scroll" data-filterable="" data-filter-label="All Locations" data-filter-parent="#locations-filter-label" data-filter-reset-label="All Locations">
        <div id="section-locations" class="feature-cards">
          
          <div class="card" data-filter="central-kentucky">
            <a href="https://www.crossroads.net/andover/" class="block"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
            <div class="card-block">
              <h4 class="card-title card-title--overlap text-uppercase">
                <a href="https://www.crossroads.net/andover/">Andover</a>
              </h4>
              <div class="card-text">
                <p>4128 Todds Rd.<br>Lexington, KY 40509 (<a target="_blank" href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174">Map</a>)</p>
                <p><strong>Service Times:</strong><br>SUN: 9:15 &amp; 11:00am</p>
              </div>
            </div>
          </div>
      
          <div class="card" data-filter="central-ohio">
            <a href="https://www.crossroads.net/columbus/" class="block"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
            <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://www.crossroads.net/columbus/">Columbus</a>
                </h4>
                <div class="card-text">
                  <p><a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a></p>
                </div>
            </div>
          </div>
          
          <div class="card" data-filter="northern-ohio">
            <a href="https://www.crossroads.net/cleveland/" class="block"><img alt="Cleveland" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
            <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://www.crossroads.net/cleveland/">Cleveland</a>
                </h4>
                <div class="card-text">
                  <p><a href="https://www.crossroads.net/cleveland/">Get more information on Crossroads Cleveland</a></p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    document.body.innerHTML = test_dom;
  });

  describe("new CardFilter()", () => {
    let cardFilter, element;
    window.Mustache = {
      render: function () {
      return '<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-999" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label>{{label}}</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-999">{{#reset}}<li><a href="#" data-reset>{{reset}}</a></li>{{/reset}}{{#filters}}<li><a href="#" data-filter-select="{{value}}" class="block">{{title}}</a>{{/filters}}</li></ul>';
      }
    }
    beforeEach(() => {
      element = document.querySelectorAll('[data-filterable]')[0];
      ;
    });
    
    it("has a filter_label of 'All Locations'", () => {
      spyOn(Mustache, 'render').and.returnValue({});
      cardFilter = new CRDS.CardFilter(element);
      expect(cardFilter.filter_label).toEqual('All Locations');
    });

    it("has a reset_label of 'All Locations'", () => {
      spyOn(Mustache, 'render').and.returnValue({});
      cardFilter = new CRDS.CardFilter(element);
      expect(cardFilter.reset_label).toEqual('All Locations')
    });

    it("changes a string from kebab-case to Upper Case", () => {
      spyOn(Mustache, 'render').and.returnValue({});
      cardFilter = new CRDS.CardFilter(element);
      let locationName = "central-kentucky";
      let humanizedLocationName = cardFilter.humanizeString(locationName);
      expect(humanizedLocationName).toEqual("Central Kentucky");
    });

    it("#refreshCarosel does something I don't understand");

    it("#setCurrentLabel(str) sets innerText of HTML element to str", () => {
      spyOn(Mustache, 'render').and.returnValue({});
      cardFilter = new CRDS.CardFilter(element);
      let str = "BazShiz";
      console.log(cardFilter.container.querySelector('[data-current-label]'));
      // cardFilter.setCurrentLabel(str);
      // let dataLabel = cardFilter.container.querySelector('[data-current-label]');
      // expect(humanizedLocationName).toEqual("Central Kentucky");
    });

  });
});
