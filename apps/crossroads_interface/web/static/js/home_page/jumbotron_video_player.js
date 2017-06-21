window['CRDS'] = window['CRDS'] || {};

CRDS.JumbotronVideoPlayer = function(jumbotronEl) {
  this.jumbotronEl = jumbotronEl;
  this.bgPlayerContainerEl = this.jumbotronEl.querySelector('.bg-video-player');
  this.bgPlayerId = 'video-player-' + Math.random().toString(36).substr(2, 10);

  this.bgPlayerEl = document.createElement('div');
  this.bgPlayerEl.setAttribute('id', this.bgPlayerId);
  this.bgPlayerContainerEl.appendChild(this.bgPlayerEl);

  this.bgVideoId = this.jumbotronEl.getAttribute('data-video-id');
  if (!this.bgVideoId) {
    throw 'data-player-id is required on the jumbotron containing element.';
  }

  this.inlineVideoTrigger = this.jumbotronEl.querySelector('.inline-video-trigger');
  this.inlineVideoId = this.inlineVideoTrigger.getAttribute('data-video-id') ||
                       this.bgVideoId;

  this.inlinePlayerContainerEl = this.jumbotronEl.querySelector('.inline-video-player');
  this.inlinePlayerId = 'video-player-' + Math.random().toString(36).substr(2, 10);
  this.inlinePlayerEl = document.createElement('div');
  this.inlinePlayerEl.setAttribute('id', this.inlinePlayerId);
  this.inlinePlayerContainerEl.appendChild(this.inlinePlayerEl);

  this.bgPlayerVars = {
    autoplay: 0,
    controls: 0,
    modestbranding: 1,
    loop: 1,
    playsinline: 1,
    showinfo: 0,
    playlist: this.bgVideoId // See: https://stackoverflow.com/a/25781957/2241124
  };

  this.inlinePlayerVars = {
    autoplay: 1,
    controls: 1,
    playsinline: 0,
    modestbranding: 1,
    showinfo: 0
  };

  var preloader = document.createElement('div');
      preloader.classList.add('preloader-wrapper');
      preloader.innerHTML = '\
        <svg viewBox="0 0 102 101" class="preloader preloader--top-right preloader--small"\>\
          <g fill="none" fill-rule="evenodd"\>\
            <g transform="translate(1 1)" stroke-width="2"\>\
              <ellipse stroke="#eee" cx="50" cy="49.421" rx="50" ry="49.421"\></ellipse\>\
              <path d="M50 98.842c27.614 0 50-22.127 50-49.42C100 22.125 77.614 0 50 0" stroke-opacity=".631" stroke="#3B6E8F"\></path\>\
            </g\>\
          </g\>\
        </svg\>';
  this.jumbotronEl.prepend(preloader);
  this.preloaderContainerEl = this.jumbotronEl.querySelector('.preloader-wrapper');
  this.preloaderEl = this.jumbotronEl.querySelector('.preloader');

  var closeButton = document.createElement('a');
      closeButton.classList.add('close-video');
      closeButton.innerHTML = '\
        <svg class="icon icon-2" viewBox="0 0 256 256"\>\
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#close"></use\>\
        </svg\>';
  this.inlinePlayerContainerEl.prepend(closeButton);

  this.inlineVideoTrigger.innerHTML = '\
    <svg class="icon icon-5" viewBox="0 0 256 256"\>\
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#play-thin"></use\>\
    </svg\>';

  return this.initBgVideo();
};

CRDS.JumbotronVideoPlayer.prototype.constructor = CRDS.JumbotronVideoPlayer;

CRDS.JumbotronVideoPlayer.prototype.initBgVideo = function() {
  var _this = this;
  this.bgPlayer = new YT.Player(this.bgPlayerId, {
    videoId: this.bgVideoId,
    playerVars: this.bgPlayerVars,
    events: {
      onReady: function(event) {
        _this.onBgVideoReady(event);
      },
      onStateChange: function(event) {
        _this.onBgVideoStateChange(event);
      }
    }
  });
  this.bindEvents();
  this.playBgVideo();
};

CRDS.JumbotronVideoPlayer.prototype.playBgVideo = function() {
  var _this = this;
  if (!this.bgPlayer.playVideo) {
    setTimeout(function() {
      _this.playBgVideo();
    }, 250);
    return true;
  }
  this.bgPlayer.playVideo();
};

CRDS.JumbotronVideoPlayer.prototype.onBgVideoReady = function(event) {
  this.resizePlayer();
  event.target.mute();
};

CRDS.JumbotronVideoPlayer.prototype.onBgVideoStateChange = function(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    this.preloaderContainerEl.classList.add('loaded');
  } else {
    this.preloaderContainerEl.classList.remove('loaded');
  };
};

CRDS.JumbotronVideoPlayer.prototype.resizePlayer = function() {
  var width = this.jumbotronEl.offsetWidth,
      height = this.jumbotronEl.offsetHeight,
      ratio = 16 / 9;

  // If the container is wider than the desired ratio ...
  if (width / height > ratio) {
    // The new width should be the width of the container,
    // while the new height maintains the aspect ratio.
    var newWidth = width,
        newHeight = width / ratio;

    // Resize the player.
    this.bgPlayer.setSize(newWidth, newHeight);

    // The player's container should sit at the left,
    // and at half of its excess height.
    this.bgPlayerContainerEl.style.left = 0;
    this.bgPlayerContainerEl.style.top = -((newHeight - height) / 2) + 'px';
  }
  // If the player is higher than the aspect ratio
  else {
    // The new height should be the height of the container,
    // while the new width maintains the aspect ratio.
    var newHeight = height,
        newWidth = height * ratio;

    // Resize the player.
    this.bgPlayer.setSize(newWidth, newHeight);

    // The player's container should sit at the top,
    // and at half of its excess width.
    this.bgPlayerContainerEl.style.top = 0;
    this.bgPlayerContainerEl.style.left = -((newWidth - width) / 2) + 'px';
  };
};

CRDS.JumbotronVideoPlayer.prototype.bindEvents = function() {
  var _this = this;

  window.addEventListener('resize', function(event) {
    _this.resizePlayer();
  }, true);

  this.inlineVideoTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    _this.playInlineVideo();
  }, true);

  var closeTrigger = this.inlinePlayerContainerEl.querySelector('.close-video');
  closeTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    _this.stopInlineVideo();
  }, true);
};

CRDS.JumbotronVideoPlayer.prototype.initInlineVideo = function() {
  var _this = this;
  this.inlinePlayer = new YT.Player(this.inlinePlayerId, {
    videoId: this.inlineVideoId,
    playerVars: this.inlinePlayerVars,
    events: {
      onReady: function(event) {
        _this.playInlineVideo(event);
      },
      onStateChange: function(event) {
        _this.onInlineVideoStateChange(event);
      }
    }
  });
  return true;
};

CRDS.JumbotronVideoPlayer.prototype.playInlineVideo = function(event = null) {
  if (!this.inlinePlayer) {
    this.initInlineVideo();
    return true;
  }
  this.inlinePlayerContainerEl.classList.add('active');
};

CRDS.JumbotronVideoPlayer.prototype.stopInlineVideo = function() {
  this.inlinePlayerContainerEl.classList.remove('active');
  this.inlinePlayer.stopVideo();
};

CRDS.JumbotronVideoPlayer.prototype.onInlineVideoStateChange = function(event) {
  if (event.data == YT.PlayerState.ENDED) {
    this.stopInlineVideo();
  }
};
