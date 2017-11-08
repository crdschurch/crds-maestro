/* global CRDS */
import DataTracker from '../../web/static/js/dataTracker';

describe('DataTracker', () => {
  window.analytics = jasmine.createSpyObj('analytics', ['track']);

  const testDom = `
    <button data-track-click id="btn-one">Watch Now</button>
    <button data-track-click="Do The Things" id="btn-two">Do It</button>
    <form class="searchbar" id="search1" data-track-search>
      <div class="input-group">
        <input class="form-control" placeholder="Search by address or zip code" type="text"><span class="input-group-btn"> <button class="btn btn-secondary" type="submit"></button></span>
      </div>
    </form>
    <form class="searchbar" id="search2" data-track-search="locationSearch">
      <div class="input-group">
        <input class="form-control" placeholder="Search by address or zip code" type="text"><span class="input-group-btn"> <button class="btn btn-secondary" type="submit"></button></span>
      </div>
  </form>
  `;

  let dataTracker;
  let btn1;
  let btn2;
  let search1;
  let search2;

  beforeEach(() => {
    document.body.innerHTML = testDom;
    dataTracker = new CRDS.DataTracker();
    btn1 = document.getElementById('btn-one');
    btn2 = document.getElementById('btn-two');
    search1 = document.getElementById('search1');
    search2 = document.getElementById('search2');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    dataTracker = null;
    btn1 = null;
    btn2 = null;
    search1 = null;
    search2 = null;
  });

  it('should send analytics data for search events', () => {
    search2.getElementsByTagName('input')[0].value = 'foo';
    search2.getElementsByTagName('button')[0].click();
    const trackEventPayload = {
      Name: search2.dataset.trackSearch || search2.id || 'Unnamed Search',
      Target: search2.outerHTML,
      SearchTerm: search2.getElementsByTagName('input')[0].value
    };
    expect(dataTracker.analytics.track).toHaveBeenCalledWith('Search', trackEventPayload);
  });

  it('should send analytics data for click events', () => {
    btn1.click();
    const trackEventPayload = {
      Name: btn1.dataset.trackClick || btn1.id || 'Unnamed Click Event',
      Target: btn1.outerHTML,
      Type: btn1.nodeName
    };
    expect(dataTracker.analytics.track).toHaveBeenCalledWith('ElementClicked', trackEventPayload);
  });
});
