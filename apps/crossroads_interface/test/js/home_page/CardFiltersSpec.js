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
    <h3 id="locations-filter-label" class="collection-header clearfix"><div class="dropdown"><button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-w58er" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label="">All Locations</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-w58er"><li><a href="#" data-reset="">All Locations</a></li><li><a href="#" data-filter-select="central-kentucky" class="block">Central Kentucky</a></li><li><a href="#" data-filter-select="central-ohio" class="block">Central Ohio</a></li><li><a href="#" data-filter-select="northern-ohio" class="block">Northern Ohio</a></li><li><a href="#" data-filter-select="southwest-ohio" class="block">Southwest Ohio</a></li><li><a href="#" data-filter-select="northern-kentucky" class="block">Northern Kentucky</a></li></ul></div>locations</h3>
    <div class="card-deck carousel" data-carousel="mobile-scroll" data-filterable="" data-filter-label="All Locations" data-filter-parent="#locations-filter-label" data-filter-reset-label="All Locations" data-carousel-id="carousel-ikpvz">
        <div id="section-locations" class="feature-cards flickity-enabled is-draggable" data-carousel="mobile-scroll" tabindex="0">
            <div class="flickity-viewport is-pointer-down" style="height: 481px; touch-action: none;">
                <div class="flickity-slider" style="left: 0px; transform: translateX(0%);">
                    <div class="card carousel-cell is-selected" data-filter="central-kentucky" style="position: absolute; left: 0%;">

                        <a href="https://www.crossroads.net/andover/" class="block"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/andover/">Andover</a>
      
    </h4>
                            <div class="card-text">
                                <p>4128 Todds Rd.
                                    <br>Lexington, KY 40509 (<a target="_blank" href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SUN: 9:15 &amp; 11:00am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="central-ohio" style="position: absolute; left: 110.85%;">

                        <a href="https://www.crossroads.net/columbus/" class="block"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/columbus/">Columbus</a>
      
    </h4>
                            <div class="card-text">
                                <p><a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="northern-ohio" style="position: absolute; left: 221.71%;">

                        <a href="https://www.crossroads.net/cleveland/" class="block"><img alt="Cleveland" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/crossroads-church-cleveland.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/cleveland/">Cleveland</a>
      
    </h4>
                            <div class="card-text">
                                <p><a href="https://www.crossroads.net/cleveland/">Get more information on Crossroads Cleveland</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 332.56%;">

                        <a href="https://www.crossroads.net/dayton/" class="block"><img alt="Dayton" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-dayton2.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/Uploads/locations-dayton2.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/dayton/">Dayton</a>
      
    </h4>
                            <div class="card-text">
                                <p><a href="https://www.crossroads.net/dayton/">Get more information on Crossroads Dayton</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 443.41%;">

                        <a href="https://www.crossroads.net/eastside/" class="block"><img alt="East Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-comingsoon.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-comingsoon.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/eastside/">East Side</a>
      
    </h4>
                            <div class="card-text">
                                <p>Service times coming soon!</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="northern-kentucky" style="position: absolute; left: 554.26%;">

                        <a href="https://www.crossroads.net/florence/" class="block"><img alt="Florence" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-florence.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-florence.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/florence/">Florence</a>
      
    </h4>
                            <div class="card-text">
                                <p>828 Heights Blvd&nbsp;
                                    <br>Florence KY, 41042 (<a target="_blank" href="https://www.google.com/maps/place/828+Heights+Blvd,+Florence,+KY+41042/@38.988549,-84.648451,17z/data=!4m2!3m1!1s0x8841c6ffdb1190cb:0x99fc4ea42b5e2a5b?hl=en">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SAT 5:30pm;&nbsp;
                                    <br>SUN 9:30am &amp; 11:30am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="central-kentucky" style="position: absolute; left: 665.12%;">

                        <a href="https://www.crossroads.net/georgetown/" class="block"><img alt="Georgetown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/georgetown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/georgetown.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/georgetown/">Georgetown</a>
      
    </h4>
                            <div class="card-text">
                                <p>1696 Oxford Dr.
                                    <br>Georgetown, KY 40324 (<a target="_blank" href="https://www.google.com/maps/place/1696+Oxford+Dr,+Georgetown,+KY+40324/@38.2399103,-84.5317857,17z/data=!3m1!4b1!4m5!3m4!1s0x88423ed1ae54d15f:0x39d56de8e3409d88!8m2!3d38.2399103!4d-84.529597">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SUN: 9:15 &amp; 11:00am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 775.97%;">

                        <a href="https://www.crossroads.net/mason/" class="block"><img alt="Mason" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-mason.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-mason.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/mason/">Mason</a>
      
    </h4>
                            <div class="card-text">
                                <p>990 Reading Road
                                    <br>Mason, OH 45040 (<a target="_blank" href="https://www.google.com/maps/place/990+Reading+Rd,+Mason,+OH+45040/@39.339405,-84.336552,17z/data=!3m1!4b1!4m2!3m1!1s0x8840575cc4e6c341:0xb6714fdf9bc69e40">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SAT 5pm;&nbsp;
                                    <br>SUN 9:15am &amp; 11am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 886.82%;">

                        <a href="https://www.crossroads.net/oakley/" class="block"><img alt="Oakley" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oakley.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-oakley.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/oakley/">Oakley</a>
      
    </h4>
                            <div class="card-text">
                                <p>3500 Madison Road
                                    <br>Cincinnati, OH 45209 (<a target="_blank" href="https://www.google.com/maps/place/3500+Madison+Rd,+Cincinnati,+OH+45209/@39.158102,-84.422679,16z/data=!4m2!3m1!1s0x8841ad6e8703e557:0xcd05a3170c0e632?hl=en">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SAT 4:30 &amp; 6:15pm;&nbsp;
                                    <br>SUN 8:30am, 10:05am &amp; 11:45am</p>
                                <p class="font-size-smaller"><img data-src="https://crds-cms-uploads.imgix.net/content/images/crossroads-interpret-symbol.jpg" class="imgix-fluid img-responsive" style="width: 30px;" alt="" title="" src="https://crds-cms-uploads.imgix.net/content/images/crossroads-interpret-symbol.jpg?dpr=2&amp;ixjsv=2.2.3&amp;q=50&amp;w=240"><em>ASL interpreting is now offered at the 10:05am service on Sunday mornings.</em>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 997.67%;">

                        <a href="https://www.crossroads.net/oxford/" class="block"><img alt="Oxford" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oxford.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-oxford.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/oxford/">Oxford</a>
      
    </h4>
                            <div class="card-text">
                                <p>Benton Hall, Room 102
                                    <br>510 E. High Street
                                    <br>Oxford, OH 45056 (<a target="_blank" href="https://www.google.com/maps/place/Benton+Hall,+Oxford,+OH+45056/@39.5106761,-84.7363247,17z/data=!3m1!4b1!4m2!3m1!1s0x88403d0ae1db040f:0xcec6fc4f8df8d1d">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SUN 11am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="central-kentucky" style="position: absolute; left: 1108.53%;">

                        <a href="https://www.crossroads.net/richmond/" class="block"><img alt="Richmond" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/richmond.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/richmond.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/richmond/">Richmond</a>
      
    </h4>
                            <div class="card-text">
                                <p>124 South Keeneland Dr.
                                    <br>Richmond, KY 40475 (<a target="_blank" href="https://www.google.com/maps/place/124+S+Keeneland+Dr,+Richmond,+KY+40475/@37.7747862,-84.3227528,17z/data=!3m1!4b1!4m5!3m4!1s0x8842fe8db0f6fed5:0xe31c7bc6c45cc1a1!8m2!3d37.7747862!4d-84.3205641">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SUN: 9:15 &amp; 11:00am</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 1219.38%;">

                        <a href="https://www.crossroads.net/uptown/" class="block"><img alt="Uptown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-uptown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-uptown.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/uptown/">Uptown</a>
      
    </h4>
                            <div class="card-text">
                                <p>42 Calhoun Street
                                    <br>Cincinnati, OH 45219 (<a target="_blank" href="https://www.google.com/maps/place/42+Calhoun+St,+Cincinnati,+OH+45219/@39.128289,-84.5150817,17z/data=!3m1!4b1!4m5!3m4!1s0x8841b3f2bfac6973:0x7a4c5355d732c7e6!8m2!3d39.128289!4d-84.512893">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SUN 10am, 12pm &amp; 7:30pm</p>
                            </div>
                        </div>
                    </div>
                    <div class="card carousel-cell" data-filter="southwest-ohio" style="position: absolute; left: 1330.23%;">

                        <a href="https://www.crossroads.net/westside/" class="block"><img alt="West Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-westside.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="https://crds-cms-uploads.imgix.net/content/images/locations-westside.jpg?auto=format&amp;crop=top&amp;dpr=2&amp;fit=clamp&amp;ixjsv=2.2.3&amp;q=50&amp;w=270">
                        </a>


                        <div class="card-block">
                            <h4 class="card-title card-title--overlap text-uppercase">
      
        <a href="https://www.crossroads.net/westside/">West Side</a>
      
    </h4>
                            <div class="card-text">
                                <p>8575 Bridgetown Road
                                    <br>Cleves, OH 45002 (<a target="_blank" href="https://www.google.com/maps/place/8575+Bridgetown+Rd,+Cleves,+OH+45002/@39.1605535,-84.7250682,17z/data=!4m2!3m1!1s0x8841ccf8c37b7d8d:0x145b0445f0725733?hl=en">Map</a>)</p>
                                <p><strong>Service Times:</strong>
                                    <br>SAT 5:30pm;&nbsp;
                                    <br>SUN 9:15am &amp; 11am</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`;

    document.body.innerHTML = test_dom;
  });

  describe("new CardFilter()", () => {
    window.Mustache = {
      render: function () {
      return '<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-999" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label>{{label}}</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-999">{{#reset}}<li><a href="#" data-reset>{{reset}}</a></li>{{/reset}}{{#filters}}<li><a href="#" data-filter-select="{{value}}" class="block">{{title}}</a>{{/filters}}</li></ul>';
      }
    }

    let element, cardFilter;

    beforeEach(() => {
      element = document.querySelectorAll('[data-filterable]')[0];
      spyOn(Mustache, 'render').and.returnValue({});
      spyOn(CRDS.CardFilter.prototype, 'init').and.callThrough();
      cardFilter = new CRDS.CardFilter(element);
    });
    
    it("has an element className of 'card-deck carousel'", () => {
      expect(cardFilter.el.className).toEqual("card-deck carousel"); 
    });

    it("has a container", () => {
      expect(cardFilter.container.className).toEqual('collection-header clearfix'); 
    });

    it("has a filter_label of 'All Locations'", () => {
      expect(cardFilter.filter_label).toEqual('All Locations');
    });

    it("has a reset_label of 'All Locations'", () => {
      expect(cardFilter.reset_label).toEqual('All Locations')
    });

    it("calls #init()", () => {
      expect(CRDS.CardFilter.prototype.init).toHaveBeenCalled();
    });
  });
  
  describe ("CardFilter methods", () => {
    let element, cardFilter;

    beforeEach(() => {
      element = document.querySelectorAll('[data-filterable]')[0];
      spyOn(Mustache, 'render').and.returnValue({});
      spyOn(CRDS.CardFilter.prototype, 'init').and.callThrough();
      cardFilter = new CRDS.CardFilter(element);
    });

    it("#init gets the unique filters", () => {
      let locationRegions = ['central-kentucky',
                             'central-ohio',
                             'northern-ohio',
                             'southwest-ohio',
                             'northern-kentucky']
      expect(cardFilter.filters).toEqual(locationRegions); 
    });
  
    it("#setup does a whole lot of crap");

    describe ("#click(e)", () => {
      it("#click(e) resets and activates the filter when it hasn't changed and it is undefined");

      it("#click(e) resets and activates the filter when it isn't the current one and it is undefined");

      it("#click(e) resets and activates the filter when filter hasn't changed and it is defined");

      it("#click(e) performs and activates the filter when it isn't the current one and it is defined");
    });
  });
});
