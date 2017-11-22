import CardCarousel from '../../../web/static/js/home_page/card_carousel';

/* global CRDS */

window.Flickity = function (id, options) {};

describe('CardCarousel', () => {
  const cardCarouselDom = `<div class="card-deck carousel" data-crds-carousel="mobile-scroll" data-carousel-id="carousel-a1kj76" data-filter-reset-label="All Locations">
    <div class="feature-cards card-deck--expanded-layout" data-crds-carousel="mobile-scroll" id="section-locations">
      <div class="card" data-distance="112.4" data-filter="Central Kentucky" data-location="Andover" id="distance10location1" style="order: 10;">
        <a class="block" href="/andover/"><img alt="Andover" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/crossroads-andover.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="/andover/">Andover</a></h4>
          <div class="card-text">
            <p>4128 Todds Rd.<br>
            Lexington, KY 40509 (<a href="https://www.google.com/maps/place/4128+Todds+Rd,+Lexington,+KY+40509/@37.9937646,-84.3967061,17z/data=!3m1!4b1!4m5!3m4!1s0x884251ca9bb3bbe3:0xcb54c66f36e9147f!8m2!3d37.9937646!4d-84.3945174" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SUN: 9:15 &amp; 11:00am</p>
          </div><span class="distance">112.4</span>
        </div>
      </div>      
      <div class="card" data-distance="38.1" data-filter="Northern Kentucky" data-location="Florence" id="distance6location6" style="order: 6;">
        <a class="block" href="https://www.crossroads.net/florence/"><img alt="Florence" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-florence.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-florence.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/florence/">Florence</a></h4>
          <div class="card-text">
            <p>828 Heights Blvd&nbsp;<br>
            Florence KY, 41042 (<a href="https://www.google.com/maps/place/828+Heights+Blvd,+Florence,+KY+41042/@38.988549,-84.648451,17z/data=!4m2!3m1!1s0x8841c6ffdb1190cb:0x99fc4ea42b5e2a5b?hl=en" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SAT 5:30pm;&nbsp;<br>
            SUN 9:30am &amp; 11:30am</p>
          </div><span class="distance">38.1</span>
        </div>
      </div>
      <div class="card" data-distance="92.8" data-filter="Central Kentucky" data-location="Georgetown" id="distance9location7" style="order: 9;">
        <a class="block" href="https://www.crossroads.net/georgetown/"><img alt="Georgetown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/georgetown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/georgetown.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/georgetown/">Georgetown</a></h4>
          <div class="card-text">
            <p>1696 Oxford Dr.<br>
            Georgetown, KY 40324 (<a href="https://www.google.com/maps/place/1696+Oxford+Dr,+Georgetown,+KY+40324/@38.2399103,-84.5317857,17z/data=!3m1!4b1!4m5!3m4!1s0x88423ed1ae54d15f:0x39d56de8e3409d88!8m2!3d38.2399103!4d-84.529597" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SUN: 9:15 &amp; 11:00am</p>
          </div><span class="distance">92.8</span>
        </div>
      </div>
      <div class="card" data-distance="14.4" data-filter="Southwest Ohio" data-location="Mason" id="distance2location8" style="order: 2;">
        <a class="block" href="https://www.crossroads.net/mason/"><img alt="Mason" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-mason.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-mason.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/mason/">Mason</a></h4>
          <div class="card-text">
            <p>990 Reading Road<br>
            Mason, OH 45040 (<a href="https://www.google.com/maps/place/990+Reading+Rd,+Mason,+OH+45040/@39.339405,-84.336552,17z/data=!3m1!4b1!4m2!3m1!1s0x8840575cc4e6c341:0xb6714fdf9bc69e40" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SAT 5pm;&nbsp;<br>
            SUN 9:15am &amp; 11am</p>
          </div><span class="distance">14.4</span>
        </div>
      </div>
      <div class="card" data-distance="17.9" data-filter="Southwest Ohio" data-location="Oakley" id="distance3location9" style="order: 3;">
        <a class="block" href="https://www.crossroads.net/oakley/"><img alt="Oakley" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oakley.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-oakley.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/oakley/">Oakley</a></h4>
          <div class="card-text">
            <p>3500 Madison Road<br>
            Cincinnati, OH 45209 (<a href="https://www.google.com/maps/place/3500+Madison+Rd,+Cincinnati,+OH+45209/@39.158102,-84.422679,16z/data=!4m2!3m1!1s0x8841ad6e8703e557:0xcd05a3170c0e632?hl=en" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SAT 4:30 &amp; 6:15pm;&nbsp;<br>
            SUN 8:30am, 10:05am &amp; 11:45am</p>
            <p class="font-size-smaller"><img alt="" class="imgix-fluid img-responsive" data-src="https://crds-cms-uploads.imgix.net/content/images/crossroads-interpret-symbol.jpg" src="https://crds-cms-uploads.imgix.net/content/images/crossroads-interpret-symbol.jpg?ixjsv=2.2.3&amp;w=140" style="width: 30px;" title=""><em>ASL interpreting is now offered at the 10:05am service on Sunday mornings.</em></p>
          </div><span class="distance">17.9</span>
        </div>
      </div>
      <div class="card" data-distance="43.1" data-filter="Southwest Ohio" data-location="Oxford" id="distance7location10" style="order: 7;">
        <a class="block" href="https://www.crossroads.net/oxford/"><img alt="Oxford" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-oxford.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-oxford.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/oxford/">Oxford</a></h4>
          <div class="card-text">
            <p>Benton Hall, Room 102<br>
            510 E. High Street<br>
            Oxford, OH 45056 (<a href="https://www.google.com/maps/place/Benton+Hall,+Oxford,+OH+45056/@39.5106761,-84.7363247,17z/data=!3m1!4b1!4m2!3m1!1s0x88403d0ae1db040f:0xcec6fc4f8df8d1d" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SUN 11am</p>
          </div><span class="distance">43.1</span>
        </div>
      </div>
      <div class="card" data-distance="115.9" data-filter="Central Ohio" data-location="Columbus" id="distance11location3" style="order: 11;">
      <a class="block" href="https://www.crossroads.net/columbus/"><img alt="Columbus" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/locations-columbus3.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
      <div class="card-block">
        <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/columbus/">Columbus</a></h4>
        <div class="card-text">
          <p><a href="https://www.crossroads.net/columbus/">Get more information on Crossroads Columbus</a></p>
        </div><span class="distance">115.9</span>
      </div>
    </div>
    <div class="card" data-distance="49.4" data-filter="Southwest Ohio" data-location="Dayton" id="distance8location4" style="order: 8;">
      <a class="block" href="https://www.crossroads.net/dayton/"><img alt="Dayton" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/Uploads/locations-dayton2.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/Uploads/locations-dayton2.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
      <div class="card-block">
        <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/dayton/">Dayton</a></h4>
        <div class="card-text">
          <p><a href="https://www.crossroads.net/dayton/">Get more information on Crossroads Dayton</a></p>
        </div><span class="distance">49.4</span>
      </div>
    </div>
    <div class="card" data-distance="13.1" data-filter="Southwest Ohio" data-location="East Side" id="distance1location5" style="order: 1;">
      <a class="block" href="https://www.crossroads.net/eastside/"><img alt="East Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-comingsoon.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-comingsoon.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
      <div class="card-block">
        <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/eastside/">East Side</a></h4>
        <div class="card-text">
          <p>Service times coming soon!</p>
        </div><span class="distance">13.1</span>
      </div>
    </div>
      <div class="card" data-distance="128.2" data-filter="Central Kentucky" data-location="Richmond" id="distance12location11" style="order: 12;">
        <a class="block" href="https://www.crossroads.net/richmond/"><img alt="Richmond" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/richmond.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/richmond.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/richmond/">Richmond</a></h4>
          <div class="card-text">
            <p>124 South Keeneland Dr.<br>
            Richmond, KY 40475 (<a href="https://www.google.com/maps/place/124+S+Keeneland+Dr,+Richmond,+KY+40475/@37.7747862,-84.3227528,17z/data=!3m1!4b1!4m5!3m4!1s0x8842fe8db0f6fed5:0xe31c7bc6c45cc1a1!8m2!3d37.7747862!4d-84.3205641" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SUN: 9:15 &amp; 11:00am</p>
          </div><span class="distance">128.2</span>
        </div>
      </div>
      <div class="card" data-distance="23.4" data-filter="Southwest Ohio" data-location="Uptown" id="distance4location12" style="order: 4;">
        <a class="block" href="https://www.crossroads.net/uptown/"><img alt="Uptown" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-uptown.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-uptown.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/uptown/">Uptown</a></h4>
          <div class="card-text">
            <p>42 Calhoun Street<br>
            Cincinnati, OH 45219 (<a href="https://www.google.com/maps/place/42+Calhoun+St,+Cincinnati,+OH+45219/@39.128289,-84.5150817,17z/data=!3m1!4b1!4m5!3m4!1s0x8841b3f2bfac6973:0x7a4c5355d732c7e6!8m2!3d39.128289!4d-84.512893" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SUN 10am, 12pm &amp; 7:30pm</p>
          </div><span class="distance">23.4</span>
        </div>
      </div>
      <div class="card" data-distance="35.3" data-filter="Southwest Ohio" data-location="West Side" id="distance5location13" style="order: 5;">
        <a class="block" href="https://www.crossroads.net/westside/"><img alt="West Side" class="card-img-top imgix-fluid" data-src="//crds-cms-uploads.imgix.net/content/images/locations-westside.jpg?h=200&amp;max-h=200w=300&amp;&amp;crop=top&amp;fit=clamp&amp;auto=format" src="http://crds-cms-uploads.imgix.net/content/images/locations-westside.jpg?auto=format&amp;crop=top&amp;fit=clamp&amp;ixjsv=2.2.3&amp;w=170"></a>
        <div class="card-block">
          <h4 class="card-title card-title--overlap text-uppercase"><a href="https://www.crossroads.net/westside/">West Side</a></h4>
          <div class="card-text">
            <p>8575 Bridgetown Road<br>
            Cleves, OH 45002 (<a href="https://www.google.com/maps/place/8575+Bridgetown+Rd,+Cleves,+OH+45002/@39.1605535,-84.7250682,17z/data=!4m2!3m1!1s0x8841ccf8c37b7d8d:0x145b0445f0725733?hl=en" target="_blank">Map</a>)</p>
            <p><strong>Service Times:</strong><br>
            SAT 5:30pm;&nbsp;<br>
            SUN 9:15am &amp; 11am</p>
          </div><span class="distance">35.3</span>
        </div>
      </div>
      <div class="card" data-filter="" data-location="Anywhere" id="distance13location2" style="order: 13;">
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

  let mockFlickity;

  beforeEach(() => {
    document.body.innerHTML = cardCarouselDom;
    mockFlickity = jasmine.createSpyObj('Flickity', ['destroy', 'reloadCells', 'selectCell']);
    spyOn(window, 'Flickity').and.returnValue(mockFlickity);
  });

  afterEach(() => {

  });

  it('should create carousel', () => {
    const carousel = new CRDS.CardCarousels();
    expect(carousel.carousels[0]).toBeDefined();
  });

  it('should sort based on some numeric value', () => {
    const carousels = new CRDS.CardCarousels();
    const carousel = carousels.carousels[0];
    carousel.sortBy('distance');
    const orderedCards = carousel.getCards();

    expect(orderedCards[0].id).toBe('distance1location5');
    expect(orderedCards[1].id).toBe('distance2location8');
    expect(orderedCards[2].id).toBe('distance3location9');
    expect(orderedCards[3].id).toBe('distance4location12');
    expect(orderedCards[4].id).toBe('distance5location13');
    expect(orderedCards[5].id).toBe('distance6location6');
    expect(orderedCards[6].id).toBe('distance7location10');
    expect(orderedCards[7].id).toBe('distance8location4');
    expect(orderedCards[8].id).toBe('distance9location7');
    expect(orderedCards[9].id).toBe('distance10location1');
    expect(orderedCards[10].id).toBe('distance11location3');
    expect(orderedCards[11].id).toBe('distance12location11');
    expect(orderedCards[12].id).toBe('distance13location2');
  });

  it('should sort based on some string value', () => {
    const carousels = new CRDS.CardCarousels();
    const carousel = carousels.carousels[0];
    carousel.sortBy('location');
    const orderedCards = carousel.getCards();

    expect(orderedCards[0].id).toBe('distance10location1');
    expect(orderedCards[1].id).toBe('distance13location2');
    expect(orderedCards[2].id).toBe('distance11location3');
    expect(orderedCards[3].id).toBe('distance8location4');
    expect(orderedCards[4].id).toBe('distance1location5');
    expect(orderedCards[5].id).toBe('distance6location6');
    expect(orderedCards[6].id).toBe('distance9location7');
    expect(orderedCards[7].id).toBe('distance2location8');
    expect(orderedCards[8].id).toBe('distance3location9');
    expect(orderedCards[9].id).toBe('distance7location10');
    expect(orderedCards[10].id).toBe('distance12location11');
    expect(orderedCards[11].id).toBe('distance4location12');
    expect(orderedCards[12].id).toBe('distance5location13');
  });

  it('should sort in reverse order', () => {
    const carousels = new CRDS.CardCarousels();
    const carousel = carousels.carousels[0];
    carousel.sortBy('-distance');
    const orderedCards = carousel.getCards();

    expect(orderedCards[0].id).toBe('distance13location2');
    expect(orderedCards[1].id).toBe('distance12location11');
    expect(orderedCards[2].id).toBe('distance11location3');
    expect(orderedCards[3].id).toBe('distance10location1');
    expect(orderedCards[4].id).toBe('distance9location7');
    expect(orderedCards[5].id).toBe('distance8location4');
    expect(orderedCards[6].id).toBe('distance7location10');
    expect(orderedCards[7].id).toBe('distance6location6');
    expect(orderedCards[8].id).toBe('distance5location13');
    expect(orderedCards[9].id).toBe('distance4location12');
    expect(orderedCards[10].id).toBe('distance3location9');
    expect(orderedCards[11].id).toBe('distance2location8');
    expect(orderedCards[12].id).toBe('distance1location5');
  });
});
