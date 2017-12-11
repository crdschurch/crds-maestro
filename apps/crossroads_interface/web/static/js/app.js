import phoenixEventListener from './phoenixEventListener';
import svgFixer from './svgFixer';
import JumbotronVideoPlayer from './home_page/jumbotron_video_player';
import CardFilters from './home_page/card_filters';
import VideoModal from './home_page/video_modal';
import Countdown from './home_page/countdown';
import LocationFinder from './home_page/location_finder';
import DistanceSorter from './home_page/distance_sorter';
import DataTracker from './dataTracker';
import UserService from './userService';
const domReady = (callback) => {
  document.addEventListener('DOMContentLoaded', callback);
};

export const App = {
  run: () => {
    phoenixEventListener();
    domReady(() => {
      svgFixer();
      const iFrameResizer = require('iframe-resizer/js/iframeResizer.min.js');
      iFrameResizer({ log: true }, '#fred');
    });
  }
};
