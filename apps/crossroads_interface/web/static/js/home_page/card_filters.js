window['CRDS'] = window['CRDS'] || {};

// ----------------------------------------------- #

CRDS.CardFilters = function(selector=undefined) {
  this.selector = selector || '[data-filterable]';
  if(typeof Mustache == 'object') {
    this.init();
  } else {
    CRDS.Utils.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js', CRDS.Utils.__bind(this.init, this));
  }
  return;
}

CRDS.CardFilters.prototype.init = function() {
  var els = document.querySelectorAll(this.selector);
  for(var i=0; i<els.length; i++) {
    new CRDS.CardFilter(els[i]);
  }
}

// ----------------------------------------------- #

CRDS.CardFilter = function(el) {
  this.el = el;
  this.container = this.el.dataset.filterParent ? document.querySelector(this.el.dataset.filterParent) : this.el;
  this.filter_label = this.el.dataset.filterLabel || 'Filter By Location...';
  this.reset_label = this.el.dataset.filterResetLabel || false;
  this.init();
  this.setup();
  return;
}

CRDS.CardFilter.prototype.init = function() {
  this.els = this.el.querySelectorAll('[data-filter]');
  this.els = Array.prototype.slice.call(this.els);

  // Get unique filters
  this.filters = this.els.map(function(filter) {
    return filter.getAttribute('data-filter');
  }).filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

CRDS.CardFilter.prototype.setup = function() {
  var args = {
    label: this.filter_label,
    reset: this.reset_label,
    filters: []
  };
  for(var i=0; i<this.filters.length; i++) {
    var filter = this.filters[i];
    args.filters.push({
      title: this.humanizeString(filter),
      value: filter
    });
  }
  var el = document.createElement('DIV');
      el.classList.add('dropdown');
      el.innerHTML = Mustache.render(this.filterHTML(), args);

  var links = el.querySelectorAll('a');

  for(var i=0; i<links.length; i++) {
    links[i].addEventListener('click', CRDS.Utils.__bind(this.click, this));
  }

  this.container.insertBefore(el, this.container.childNodes[0])
}

CRDS.CardFilter.prototype.click = function(e) {
  e.preventDefault();
  var filter = e.currentTarget.dataset.filterSelect;
  if(this.currentFilter != filter && filter != undefined) {
    this.performFilter(filter);
    this.activateFilter(e.currentTarget);
  } else {
    this.resetFilter();
    this.activateFilter(e.currentTarget);
  }
}

CRDS.CardFilter.prototype.performFilter = function(filter) {
  this.currentFilter = filter;
  this.setCurrentLabel(this.humanizeString(filter));

  for(var i=0; i<this.els.length; i++) {
    var el = this.els[i];
    var filters = el.getAttribute('data-filter').split(' ');
    el.style.display = filters.indexOf(filter) !== -1 ? 'block' : 'none';
  }
  this.refreshCarousel();
}

CRDS.CardFilter.prototype.resetFilter = function(el) {
  this.setCurrentLabel(this.reset_label);
  for(var i=0; i<this.els.length; i++) {
    this.els[i].style.display = 'block';
  }
  this.refreshCarousel();
}

CRDS.CardFilter.prototype.activateFilter = function(el=undefined) {
  var siblings = el.parentNode.parentNode.childNodes;
  for(var i=0; i<siblings.length; i++) {
    siblings[i].querySelector('a').classList.remove('on');
  }
  if(el) {
    el.classList.add('on');
  }
}

CRDS.CardFilter.prototype.setCurrentLabel = function(str) {
  this.container.querySelector('[data-current-label]').innerText = str;
}

CRDS.CardFilter.prototype.refreshCarousel = function() {
  if(this.el.dataset.carousel != undefined) {
    var id = this.el.dataset.carouselId;
    CRDS._instances[id].reload();
  }
}

CRDS.CardFilter.prototype.humanizeString = function(property) {
  return property.replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/(\w+)/g, function(match) {
      return match.charAt(0).toUpperCase() + match.slice(1);
    });
}

CRDS.CardFilter.prototype.filterHTML = function() {
  var id = Math.random().toString(36).substring(7);
  return '<button class="btn btn-outline btn-option dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-' + id + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label>{{label}}</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-' + id + '">{{#reset}}<li><a href="#" data-reset>{{reset}}</a></li>{{/reset}}{{#filters}}<li><a href="#" data-filter-select="{{value}}" class="block">{{title}}</a>{{/filters}}</li></ul>';
}
