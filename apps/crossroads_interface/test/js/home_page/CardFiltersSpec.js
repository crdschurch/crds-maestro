import { CardFilters } from '../../../web/static/js/home_page/card_filters';

describe('CardFilters', () => {
  describe('new CardFilters()', () => {
    it('adds a mustache script tag if the DOM does not have a Mustache object defined', () => {
      delete (window.Mustache);
      spyOn(CRDS.CardFilters.prototype, 'init');
      new CRDS.CardFilters();
      const mustacheUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js';
      expect(document.head.innerHTML).toContain(mustacheUrl);
    });
  });
});
