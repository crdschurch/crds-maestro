// window.__forceSmoothScrollPolyfill__ = true;
require('smoothscroll-polyfill').polyfill();

if (typeof Slim === 'undefined') {
  require('slim-js');
}

Slim.tag(
  'smooth-scroller',
  `<span bind click="scroll">{{label}}</span>`,
  class SmoothScroller extends Slim {

    onAdded() {
      this.label = this.getAttribute('label');
      $(document).ready(() => {
        this.scrollTargetId = this.getAttribute('scroll-to');
        this.scrollTarget = document.getElementById(this.scrollTargetId);
      });
    }

    scroll() {
      this.scrollTarget.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
);
