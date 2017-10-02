window.CRDS = window.CRDS || {};

// ----------------------------------------------- #
/* global CRDS Mustache */

CRDS.CardFilters = function CardFilters(selector = undefined) {
  this.selector = selector || '[data-filterable]';
  if (typeof Mustache === 'object') {
    this.init();
  } else {
    this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js', this.init.bind(this));
  }
};

CRDS.CardFilters.prototype.loadScript = function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onreadystatechange = callback;
  script.onload = callback;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
};

CRDS.CardFilters.prototype.init = function init() {
  this.cardFilters = [];
  const els = document.querySelectorAll(this.selector);
  for (let i = 0; i < els.length; i += 1) {
    this.cardFilters[i] = new CRDS.CardFilter(els[i]);
  }
};

// ----------------------------------------------- #

CRDS.CardFilter = function CardFilter(el) {
  this.el = el;
  this.container = document.querySelector(this.el.dataset.filterParent) ? document.querySelector(this.el.dataset.filterParent) : this.el;
  this.filter_label = this.el.dataset.filterLabel || 'Filter By Location...';
  this.reset_label = this.el.dataset.filterResetLabel || false;
  this.init();
  this.setup();
};

CRDS.CardFilter.prototype.init = function init() {
  this.els = this.el.querySelectorAll('[data-filter]');
  this.els = Array.prototype.slice.call(this.els);

  // Get unique filters
  this.filters = this.els.reduce((acc, card) => acc.concat(card.getAttribute('data-filter').split(',')), []).filter((item, i, ar) => ar.indexOf(item) === i);
};

CRDS.CardFilter.prototype.setup = function setup() {
  const args = {
    label: this.filter_label,
    reset: this.reset_label,
    filters: []
  };
  for (let i = 0; i < this.filters.length; i += 1) {
    const filter = this.filters[i];
    args.filters.push({
      title: this.humanizeString(filter),
      value: filter
    });
  }
  const el = document.createElement('DIV');
  el.classList.add('dropdown');
  el.innerHTML = Mustache.render(this.filterHTML(), args);

  const links = el.querySelectorAll('a');

  for (let i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', this.click.bind(this));
  }

  this.container.insertBefore(el, this.container.childNodes[0]);
};

CRDS.CardFilter.prototype.click = function click(e) {
  e.preventDefault();
  const filter = e.currentTarget.dataset.filterSelect;
  if (this.currentFilter !== filter && filter !== undefined) {
    this.performFilter(filter);
    this.activateFilter(e.currentTarget);
  } else {
    this.resetFilter();
    this.activateFilter(e.currentTarget);
  }
};

CRDS.CardFilter.prototype.performFilter = function performFilter(filter) {
  this.currentFilter = filter;
  this.setCurrentLabel(this.humanizeString(filter));

  for (let i = 0; i < this.els.length; i += 1) {
    const el = this.els[i];
    const filters = el.getAttribute('data-filter').split(',');
    el.style.display = filters.indexOf(filter) !== -1 ? 'block' : 'none';
  }
  this.refreshCarousel();
};

CRDS.CardFilter.prototype.resetFilter = function resetFilter() {
  this.setCurrentLabel(this.reset_label);
  for (let i = 0; i < this.els.length; i += 1) {
    this.els[i].style.display = 'block';
  }
  this.refreshCarousel();
};

CRDS.CardFilter.prototype.activateFilter = function activateFilter(el = undefined) {
  const siblings = el.parentNode.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i += 1) {
    siblings[i].querySelector('a').classList.remove('on');
  }
  if (el) {
    el.classList.add('on');
  }
};

CRDS.CardFilter.prototype.setCurrentLabel = function setCurrentLabel(str) {
  this.container.querySelector('[data-current-label]').innerText = str;
};

CRDS.CardFilter.prototype.refreshCarousel = function refreshCarousel() {
  if (this.el.dataset.carousel !== undefined) {
    const id = this.el.dataset.carouselId;
    CRDS._instances[id].reload();
  }
};

CRDS.CardFilter.prototype.humanizeString = function humanizeString(property) {
  return property.replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/(\w+)/g, match => match.charAt(0).toUpperCase() + match.slice(1));
};

CRDS.CardFilter.prototype.filterHTML = function filterHTML() {
  const id = Math.random().toString(36).substring(7);
  return `<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label>{{label}}</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-${id}">{{#reset}}<li><a href="#" data-reset>{{reset}}</a></li>{{/reset}}{{#filters}}<li><a href="#" data-filter-select="{{value}}" class="block">{{title}}</a>{{/filters}}</li></ul>`;
};
