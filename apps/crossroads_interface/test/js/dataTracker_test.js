/* global CRDS */
import DataTracker from '../../web/static/js/dataTracker';

describe('DataTracker', () => {
  window.analytics = jasmine.createSpyObj('analytics', ['track']);

  const testDom = `
    <button data-track-click id="btn-one">Watch Now</button>
    <form class="searchbar" id="search2" data-track-search="locationSearch">
      <div class="input-group">
        <input class="form-control" placeholder="Search by address or zip code" type="text"><span class="input-group-btn"> <button class="btn btn-secondary" type="submit"></button></span>
      </div>
    </form>
  `;

  let dataTracker;
  let btn;
  let search;

  beforeEach(() => {
    document.body.innerHTML = testDom;
    dataTracker = new CRDS.DataTracker();
    btn = document.getElementById('btn-one');
    search = document.getElementById('search2');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    dataTracker = null;
    btn = null;
    search = null;
  });

  it('should send analytics data for search events', () => {
    search.getElementsByTagName('input')[0].value = 'foo';
    search.getElementsByTagName('button')[0].click();
    const trackEventPayload = {
      Name: search.dataset.trackSearch || search.id || 'Unnamed Search',
      Target: search.outerHTML,
      SearchTerm: search.getElementsByTagName('input')[0].value
    };
    expect(dataTracker.analytics.track).toHaveBeenCalledWith('Search', trackEventPayload);
  });

  it('should send analytics data for click events', () => {
    btn.click();
    const trackEventPayload = {
      Name: btn.dataset.trackClick || btn.id || 'Unnamed Click Event',
      Target: btn.outerHTML,
      Type: btn.nodeName
    };
    expect(dataTracker.analytics.track).toHaveBeenCalledWith('ElementClicked', trackEventPayload);
  });
});
