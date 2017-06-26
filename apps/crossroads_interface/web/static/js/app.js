import { SharedHeader } from 'crds-shared-header/dist/bundle';
import phoenixEventListener from './phoenixEventListener';
import svgFixer from './svgFixer';

import JumbotronVideoPlayer from './home_page/jumbotron_video_player';
import CardCarousel from './home_page/card_carousel';
import CardFilters from './home_page/card_filters';
import VideoModal from './home_page/video_modal';

export var App = {
  run: function() {
    phoenixEventListener();
    domReady(svgFixer);
  }
}

function domReady(callback) {
  document.addEventListener("DOMContentLoaded", callback);
}
