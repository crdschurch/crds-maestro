import { CardFilter } from '../../../web/static/js/home_page/card_filters';

/* global CRDS Mustache */

describe('CardFilter', () => {
  window.Mustache = {
    render() {}
  };
  window.imgix = {
    fluid() {}
  };
  beforeEach(() => {
    const testDom = `
      <section class="container" ng-non-bindable="">
        <h3 id="locations-filter-label" class="collection-header clearfix">locations</h3>
        <div class="card-deck carousel" data-crds-carousel="mobile-scroll" data-filterable="" data-filter-label="All Locations" data-filter-parent="#locations-filter-label" data-filter-reset-label="All Locations">
          <div id="section-locations" class="feature-cards">
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/mason/" class="block"><img alt="Mason" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-mason.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/mason/">Mason</a>
                </h4>
                <div class="card-text">
                  <p>990 Reading Road<br>Mason, OH 45040 (<a target="_blank" href="https://www.google.com/maps/place/990+Reading+Rd,+Mason,+OH+45040/@39.339405,-84.336552,17z/data=!3m1!4b1!4m2!3m1!1s0x8840575cc4e6c341:0xb6714fdf9bc69e40">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SAT 5pm; <br>SUN 9:15am &amp; 11am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/oakley/" class="block"><img alt="Oakley" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oakley.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/oakley/">Oakley</a>
                </h4>
                <div class="card-text">
                  <p>3500 Madison Road<br>Cincinnati, OH 45209 (<a target="_blank" href="https://www.google.com/maps/place/3500+Madison+Rd,+Cincinnati,+OH+45209/@39.158102,-84.422679,16z/data=!4m2!3m1!1s0x8841ad6e8703e557:0xcd05a3170c0e632?hl=en">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SAT 4:30 &amp; 6:15pm; <br>SUN 8:30am, 10:05am &amp; 11:45am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/oxford/" class="block"><img alt="Oxford" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oxford.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/oxford/">Oxford</a>
                </h4>
                <div class="card-text">
                  <p>Benton Hall, Room 102<br>510 E. High Street<br>Oxford, OH 45056 (<a target="_blank" href="https://www.google.com/maps/place/Benton+Hall,+Oxford,+OH+45056/@39.5106761,-84.7363247,17z/data=!3m1!4b1!4m2!3m1!1s0x88403d0ae1db040f:0xcec6fc4f8df8d1d">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SUN 11am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/uptown/" class="block"><img alt="Uptown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-uptown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/uptown/">Uptown</a>
                </h4>
                <div class="card-text">
                  <p>42 Calhoun Street<br>Cincinnati, OH 45219 (<a target="_blank" href="https://www.google.com/maps/place/42+Calhoun+St,+Cincinnati,+OH+45219/@39.128289,-84.5150817,17z/data=!3m1!4b1!4m5!3m4!1s0x8841b3f2bfac6973:0x7a4c5355d732c7e6!8m2!3d39.128289!4d-84.512893">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SUN 10:30am &amp; 7:30pm</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/eastside/" class="block"><img alt="East Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-comingsoon.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/eastside/">East Side</a>
                </h4>
                <div class="card-text">
                  <p>Service times coming soon!</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/westside/" class="block"><img alt="West Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-westside.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/westside/">West Side</a>
                </h4>
                <div class="card-text">
                  <p>8575 Bridgetown Road<br>Cleves, OH 45002 (<a target="_blank" href="https://www.google.com/maps/place/8575+Bridgetown+Rd,+Cleves,+OH+45002/@39.1605535,-84.7250682,17z/data=!4m2!3m1!1s0x8841ccf8c37b7d8d:0x145b0445f0725733?hl=en">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SAT 5:30pm; <br>SUN 9:15am &amp; 11am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="central-ohio">
              <a href="https://int.crossroads.net/columbus/" class="block"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/crossroads-church-columbus.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/columbus/">Columbus</a>
                </h4>
                <div class="card-text">
                  <p><a href="https://int.crossroads.net/columbus/">Get more information on Crossroads Columbus</a></p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="northern-ohio">
              <a href="https://int.crossroads.net/cleveland/" class="block"><img alt="Cleveland" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/cleveland/">Cleveland</a>
                </h4>
                <div class="card-text">
                  <p><a href="https://int.crossroads.net/cleveland/">Get more information on Crossroads Cleveland</a></p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="southwest-ohio">
              <a href="https://int.crossroads.net/dayton/" class="block"><img alt="Dayton" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-dayton.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/dayton/">Dayton</a>
                </h4>
                <div class="card-text">
                  <p><a href="https://int.crossroads.net/dayton/">Get more information on Crossroads Dayton</a></p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="northern-kentucky">
              <a href="https://int.crossroads.net/florence/" class="block"><img alt="Florence" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-florence.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/florence/">Florence</a>
                </h4>
                <div class="card-text">
                  <p>828 Heights Blvd <br>Florence KY, 41042 (<a target="_blank" href="https://www.google.com/maps/place/828+Heights+Blvd,+Florence,+KY+41042/@38.988549,-84.648451,17z/data=!4m2!3m1!1s0x8841c6ffdb1190cb:0x99fc4ea42b5e2a5b?hl=en">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SAT 5:30pm; <br>SUN 9:30am &amp; 11:30am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="central-kentucky">
              <a href="https://int.crossroads.net/andover/" class="block"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/andover/">Andover</a>
                </h4>
                <div class="card-text">
                  <p>4128 Todds Rd.<br>Lexington, KY 40509 (<a target="_blank" href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SUN: 9:15 &amp; 11:00am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="central-kentucky">
              <a href="https://int.crossroads.net/georgetown/" class="block"><img alt="Georgetown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/georgetown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://int.crossroads.net/georgetown/">Georgetown</a>
                </h4>
                <div class="card-text">
                  <p>1696 Oxford Dr.<br>Georgetown, KY 40324 (<a target="_blank" href="https://www.google.com/maps/place/1696+Oxford+Dr,+Georgetown,+KY+40324/@38.2399103,-84.5317857,17z/data=!3m1!4b1!4m5!3m4!1s0x88423ed1ae54d15f:0x39d56de8e3409d88!8m2!3d38.2399103!4d-84.529597">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SUN: 9:15 &amp; 11:00am</p>
                </div>
              </div>
            </div>
            <div class="card" data-filter="central-kentucky">
              <a href="https://www.crossroads.net/richmond/" class="block"><img alt="Richmond" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/richmond.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format"></a>
              <div class="card-block">
                <h4 class="card-title card-title--overlap text-uppercase">
                  <a href="https://www.crossroads.net/richmond/">Richmond</a>
                </h4>
                <div class="card-text">
                  <p>124 South Keeneland Dr.<br>Richmond, KY 40475 (<a target="_blank" href="https://www.google.com/maps/place/124+S+Keeneland+Dr,+Richmond,+KY+40475/@37.7747862,-84.3227528,17z/data=!3m1!4b1!4m5!3m4!1s0x8842fe8db0f6fed5:0xe31c7bc6c45cc1a1!8m2!3d37.7747862!4d-84.3205641">Map</a>)</p>
                  <p><strong>Service Times:</strong><br>SUN: 9:15 &amp; 11:00am</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.body.innerHTML = testDom;
    spyOn(CRDS.CardFilter.prototype, 'refreshCarousel').and.returnValue({});
  });

  describe('new CardFilter()', () => {
    let element;
    let cardFilter;

    const mustacheTemplate = '<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-foobar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg><span data-current-label>mylabel</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-foobar"><li><a href="#" data-reset>myreset</a></li><li><a href="#" data-filter-select="southwest-ohio" class="block">My Wonderful Foobar</a></li></ul>';

    beforeEach(() => {
      element = document.querySelectorAll('[data-filterable]')[0];
      spyOn(Mustache, 'render').and.returnValue(mustacheTemplate);
      spyOn(CRDS.CardFilter.prototype, 'init').and.callThrough();
      cardFilter = new CRDS.CardFilter(element);
    });

    it("has an element className of 'card-deck carousel'", () => {
      expect(cardFilter.el.className).toEqual('card-deck carousel');
    });

    it('has a container', () => {
      expect(cardFilter.container.className).toEqual('collection-header clearfix');
    });

    it("has a filter_label of 'All Locations'", () => {
      expect(cardFilter.filter_label).toEqual('All Locations');
    });

    it("has a reset_label of 'All Locations'", () => {
      expect(cardFilter.reset_label).toEqual('All Locations');
    });

    it('calls #init()', () => {
      expect(CRDS.CardFilter.prototype.init).toHaveBeenCalled();
    });
  });

  describe('methods', () => {
    let element;
    let cardFilter;

    const mustacheTemplate = '<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-foobar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg><span data-current-label>mylabel</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-foobar"><li><a href="#" data-reset>myreset</a></li><li><a href="#" data-filter-select="southwest-ohio" class="block">My Wonderful Foobar</a></li></ul>';

    beforeEach(() => {
      element = document.querySelectorAll('[data-filterable]')[0];
      spyOn(Mustache, 'render').and.returnValue(mustacheTemplate);
    });

    it('#init gets the unique filters', () => {
      cardFilter = new CRDS.CardFilter(element);
      const locationRegions = ['southwest-ohio', 'central-ohio', 'northern-ohio', 'northern-kentucky', 'central-kentucky'];
      expect(cardFilter.filters).toEqual(locationRegions);
    });

    it('#setup adds html to div.dropdown element', () => {
      const cardFilter = new CRDS.CardFilter(element);
      const dropdown = document.getElementsByClassName('dropdown')[0];
      expect(dropdown.innerHTML).toContain('foobar');
    });

    it('#setup inserts HTML before this.container', () => {
      const locationsH3 = document.getElementById('locations-filter-label');
      expect(locationsH3.innerText).toEqual('locations');
      expect(locationsH3.innerHTML).not.toContain('div class="dropdown"');
      const cardFilter = new CRDS.CardFilter(element);
      expect(locationsH3.innerHTML).toContain('div class="dropdown"');
    });

    it('dropdown should contain data-filter-reset-label value at top of list', () => {
      const args = { label: 'All Locations', reset: 'All Locations', filters: ['southwest-ohio', 'central-ohio', 'northern-ohio', 'northern-kentucky', 'central-kentucky'] };
      cardFilter = new CRDS.CardFilter(element);
      expect(Mustache.render).toHaveBeenCalledWith(jasmine.any(String), args);
    });

    describe('#click(e)', () => {
      const checkBlockStyling = (cardList) => {
        let result;
        for (let i = 0; i < cardList.length; i++) {
          cardList[i].style.display != 'block' ? result = false : result = true;
        }
        return result;
      };
      describe('resets and activates the filter', () => {
        beforeEach(() => {
          cardFilter = new CRDS.CardFilter(element);
        });

        it('when reset option is selected', () => {
          const dataFilterSelect = document.querySelectorAll('[data-reset]')[0];
          spyOn(CRDS.CardFilter.prototype, 'resetFilter');
          spyOn(CRDS.CardFilter, 'activateFilter');
          const domEvent = {
            preventDefault() {},
            currentTarget: dataFilterSelect
          };

          cardFilter.click(domEvent);
          cardFilter.click(domEvent);

          expect(CRDS.CardFilter.prototype.resetFilter).toHaveBeenCalled();
          expect(CRDS.CardFilter.activateFilter).toHaveBeenCalled();
        });
      });

      describe("when filter isn't the currently selected one and it is defined", () => {
        let dataFilterSelect;
        let domEvent;
        beforeEach(() => {
          cardFilter = new CRDS.CardFilter(element);
          dataFilterSelect = document.querySelectorAll('[data-filter-select]')[0];
          domEvent = {
            preventDefault() {},
            currentTarget: dataFilterSelect
          };
        });

        it("activates the filter and adds the class of 'on' to the list anchor element", () => {
          expect(cardFilter.container.innerHTML).not.toContain('class="block on"');

          cardFilter.click(domEvent);

          expect(cardFilter.container.innerHTML).toContain('class="block on"');
        });

        it('performs the filtering on the location items', () => {
          const displayedCardsList = document.querySelectorAll('[data-filter="southwest-ohio"]');
          let allCardsHaveStyleBlock = checkBlockStyling(displayedCardsList);

          expect(allCardsHaveStyleBlock).toEqual(false);

          cardFilter.click(domEvent);

          allCardsHaveStyleBlock = checkBlockStyling(displayedCardsList);

          expect(cardFilter.currentFilter).toEqual(domEvent.currentTarget.dataset.filterSelect);
          expect(allCardsHaveStyleBlock).toEqual(true);
          expect(CRDS.CardFilter.prototype.refreshCarousel).toHaveBeenCalled();
        });
      });

      describe('when data-filter-reset-label is set to an existing feature', () => {
        beforeEach(() => {
          element = document.querySelectorAll('[data-filter-reset-label]')[0];
          element.setAttribute('data-filter-reset-label', 'central-ohio');
        });
        it('dropdown should contain data-filter-reset-label value only once at top of list', () => {
          const args = { label: 'All Locations', reset: false, filters: ['central-ohio', 'southwest-ohio', 'northern-ohio', 'northern-kentucky', 'central-kentucky'] };
          cardFilter = new CRDS.CardFilter(element);
          expect(Mustache.render).toHaveBeenCalledWith(jasmine.any(String), args);
        });
        it('dropdown should contain data-filter-reset-label value only once at top of list even when first already', () => {
          element.setAttribute('data-filter-reset-label', 'southwest-ohio');
          const args = { label: 'All Locations', reset: false, filters: ['southwest-ohio', 'central-ohio', 'northern-ohio', 'northern-kentucky', 'central-kentucky'] };
          cardFilter = new CRDS.CardFilter(element);
          expect(Mustache.render).toHaveBeenCalledWith(jasmine.any(String), args);
        });
        it('should by default show only features that have a filter matching data-filter-reset-label', () => {
          cardFilter = new CRDS.CardFilter(element);
          const filteredCardsList = document.querySelectorAll(':not([data-filter="central-ohio"])');
          const filteredCardsHaveStyleBlock = checkBlockStyling(filteredCardsList);
          expect(filteredCardsHaveStyleBlock).toEqual(false);
          const displayedCardsList = document.querySelectorAll('[data-filter="central-ohio"]');
          const displayedCardsHaveStyleBlock = checkBlockStyling(displayedCardsList);
          expect(cardFilter.currentFilter).toEqual('central-ohio');
          expect(displayedCardsHaveStyleBlock).toEqual(true);
        });
      });
    });
  });
});
