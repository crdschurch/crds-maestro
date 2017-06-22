window['CRDS'] = window['CRDS'] || {};

// ----------------------------------------------- #

CRDS.CardFilters = function(selector=undefined) {
  var els = document.querySelectorAll(selector || '[data-filterable]');
  for(var i=0; i<els.length; i++) {
    new CRDS.CardFilter(els[i]);
  }
}

// ----------------------------------------------- #

CRDS.CardFilter = function(el) {
  this.container = el;
  this.blank_option = this.container.dataset.filterLabel || 'Filter By Location...';
  this.init();
  this.setup();
  return;
}

CRDS.CardFilter.prototype.__bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

CRDS.CardFilter.prototype.init = function() {
  this.els = this.container.querySelectorAll('[data-filter]');
  this.els = Array.prototype.slice.call(this.els);

  // Get unique filters
  this.filters = this.els.map(function(filter) {
    return filter.getAttribute('data-filter');
  }).filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

CRDS.CardFilter.prototype.setup = function() {
  var blank = document.createElement('OPTION');
      blank.setAttribute('value', '');
      blank.appendChild(document.createTextNode(this.blank_option));

  var el = document.createElement('SELECT');
      el.addEventListener('change', this.__bind(this.change, this));
      el.appendChild(blank);
      el.classList.add('form-control');
      el.classList.add('filter-control');

  for(var i=0; i<this.filters.length; i++) {
    var str = this.humanizeString(this.filters[i])
    var text = document.createTextNode(str);
    var opt = document.createElement('OPTION');
        opt.setAttribute('value', '#' + this.filters[i]);
        opt.appendChild(text);
    el.appendChild(opt);
  }

  this.container.insertBefore(el, this.container.childNodes[0]);
}

CRDS.CardFilter.prototype.change = function(e) {
  var el = e.currentTarget;
  var filter = el[el.selectedIndex].value.substr(1);

  if(this.currentFilter != filter && filter != '') {
    this.performFilter(filter);
  } else {
    this.resetFilter();
  }
  e.preventDefault();
}

CRDS.CardFilter.prototype.performFilter = function(filter) {
  this.currentFilter = filter;
  for(var i=0; i<this.els.length; i++) {
    var el = this.els[i];
    var filters = el.getAttribute('data-filter').split(' ');
    el.style.display = filters.indexOf(filter) !== -1 ? 'block' : 'none';
  }
  this.refreshCarousel();
}

CRDS.CardFilter.prototype.resetFilter = function(e) {
  for(var i=0; i<this.els.length; i++) {
    this.els[i].style.display = 'block';
  }
  this.refreshCarousel();
}

CRDS.CardFilter.prototype.refreshCarousel = function() {
  if(this.container.dataset.carousel != undefined) {
    var id = this.container.dataset.carouselId;
    CRDS._instances[id].flickity.reloadCells();
  }
}

CRDS.CardFilter.prototype.humanizeString = function(property) {
  return property.replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/(\w+)/g, function(match) {
      return match.charAt(0).toUpperCase() + match.slice(1);
    });
}
