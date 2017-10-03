import phoenixEventListener from './phoenixEventListener';
import svgFixer from './svgFixer';
import JumbotronVideoPlayer from './home_page/jumbotron_video_player';
import CardCarousel from './home_page/card_carousel';
import CardFilters from './home_page/card_filters';
import VideoModal from './home_page/video_modal';

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

      // TODO: move to separate file
      let loaded;
      const imgixInlineImages = $('img.imgix-fluid');

      const intervalId = setInterval(() => {
        loaded = true;
        for (let i = 0; imgixInlineImages[i]; ++i) {
          if (!imgixInlineImages[i].hasAttribute('src')) {
            loaded = false;
          }
        }

        if (loaded) {
          clearInterval(intervalId);
          window.dispatchEvent(new Event('resize'));
        }
      }, 100);
    });
  }
};
