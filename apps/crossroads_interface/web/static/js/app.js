import { SharedHeader } from 'crds-shared-header/dist/bundle';
import phoenixEventListener from './phoenixEventListener';
import svgFixer from './svgFixer';

export var App = {
  run: function() {
    phoenixEventListener();
    domReady(svgFixer);
  }
}

function domReady(callback) {
  document.addEventListener("DOMContentLoaded", callback);
}
