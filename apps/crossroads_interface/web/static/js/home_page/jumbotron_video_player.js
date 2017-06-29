window['CRDS'] = window['CRDS'] || {};

// ---------------------------------------- JumbotronVideoPlayers

CRDS.JumbotronVideoPlayers = function() {
  if(typeof YT == 'object') {
    this.init();
  } else {
    var jsUrl = 'https://www.youtube.com/iframe_api';
    this.loadScript(jsUrl, this.__bind(this.init, this));
  }
  return;
};

CRDS.JumbotronVideoPlayers.prototype.__bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

CRDS.JumbotronVideoPlayers.prototype.loadScript = function(url, callback) {
  var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onreadystatechange = callback;
      script.onload = callback;
  var head = document.getElementsByTagName('head')[0];
      head.appendChild(script);
}

CRDS.JumbotronVideoPlayers.prototype.init = function() {
  var bgVideoPlayers = document.querySelectorAll('.jumbotron.bg-video');
  for (var i = 0; i < bgVideoPlayers.length; i++) {
    new CRDS.JumbotronBgVideoPlayer(bgVideoPlayers[i]);
  }
  var inlineVideoPlayers = document.querySelectorAll('.jumbotron.inline-video');
  for (var i = 0; i < inlineVideoPlayers.length; i++) {
    new CRDS.JumbotronInlineVideoPlayer(inlineVideoPlayers[i]);
  }
}

// ---------------------------------------- JumbotronBgVideoPlayer

CRDS.JumbotronVideoPlayer = function(jumbotronEl) {
  this.jumbotronEl = jumbotronEl;
  this.interval = setInterval(this.__bind(this.checkYoutubeStatus, this), 100);
  return;
}

CRDS.JumbotronVideoPlayer.prototype.checkYoutubeStatus = function() {
  if(typeof YT == 'object' && typeof YT.Player == 'function') {
    clearInterval(this.interval);
    this.init();
  }
}

CRDS.JumbotronVideoPlayer.prototype.__bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

CRDS.JumbotronVideoPlayer.prototype.init = function() {
  this.bgPlayerContainerEl = this.jumbotronEl.querySelector('.bg-video-player');
  this.bgPlayerId = 'video-player-' + Math.random().toString(36).substr(2, 10);

  this.bgPlayerEl = document.createElement('div');
  this.bgPlayerEl.setAttribute('id', this.bgPlayerId);
  this.bgPlayerContainerEl.appendChild(this.bgPlayerEl);

  this.bgVideoId = this.jumbotronEl.getAttribute('data-video-id');
  if (!this.bgVideoId) {
    throw 'data-player-id is required on the jumbotron containing element.';
  }

  this.bgPlayerVars = {
    autoplay: 0,
    controls: 0,
    modestbranding: 1,
    loop: 1,
    playsinline: 1,
    showinfo: 0,
    playlist: this.bgVideoId // See: https://stackoverflow.com/a/25781957/2241124
  };

  var preloader = document.createElement('div');
      preloader.classList.add('inline-preloader-wrapper');
      preloader.innerHTML = '\
        <svg viewBox="0 0 102 101" class="inline-preloader inline-preloader--top-right inline-preloader--small"\>\
          <g fill="none" fill-rule="evenodd"\>\
            <g transform="translate(1 1)" stroke-width="2"\>\
              <ellipse stroke="#eee" cx="50" cy="49.421" rx="50" ry="49.421"\></ellipse\>\
              <path d="M50 98.842c27.614 0 50-22.127 50-49.42C100 22.125 77.614 0 50 0" stroke-opacity=".631" stroke="#3B6E8F"\></path\>\
            </g\>\
          </g\>\
        </svg\>';
  this.jumbotronEl.insertBefore(preloader, this.jumbotronEl.firstChild);
  this.preloaderContainerEl = this.jumbotronEl.querySelector('.inline-preloader-wrapper');
  this.preloaderEl = this.jumbotronEl.querySelector('.inline-preloader');

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
        _this.playBgVideo();
      },
      onStateChange: function(event) {
        _this.onBgVideoStateChange(event);
      }
    }
  });
  this.bindEvents();
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
};

// ---------------------------------------- JumbotronInlineVideoPlayer

CRDS.JumbotronInlineVideoPlayer = function(jumbotronEl) {
  this.jumbotronEl = jumbotronEl;
  this.init();
  return;
};

CRDS.JumbotronInlineVideoPlayer.prototype.init = function() {
  this.videoTrigger = this.jumbotronEl.querySelector('.inline-video-trigger');
  this.videoTrigger.innerHTML = '\
    <svg class="icon icon-5" viewBox="0 0 256 256"\>\
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#play-thin"></use\>\
    </svg\>';

  this.videoId = this.videoTrigger.getAttribute('data-video-id')
  this.playerContainerEl = this.jumbotronEl.querySelector('.inline-video-player');
  this.playerId = 'video-player-' + Math.random().toString(36).substr(2, 10);
  this.playerEl = document.createElement('div');
  this.playerEl.setAttribute('id', this.playerId);
  this.playerContainerEl.appendChild(this.playerEl);

  this.playerOptions = {
    autoplay: 1,
    controls: 1,
    playsinline: 0,
    modestbranding: 1,
    showinfo: 0
  };

  this.closeButton = document.createElement('a');
  this.closeButton.classList.add('close-video');
  this.closeButton.innerHTML = '\
    <svg class="icon icon-2" viewBox="0 0 256 256"\>\
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#close"></use\>\
    </svg\>';

  this.playerContainerEl.insertBefore(this.closeButton, this.playerContainerEl.firstChild);

  this.bindEvents();
};

CRDS.JumbotronInlineVideoPlayer.prototype.initVideo = function() {
  var _this = this;
  this.player = new YT.Player(this.playerId, {
    videoId: this.videoId,
    playerVars: this.playerOptions,
    events: {
      onReady: function(event) {
        _this.playVideo(event);
      },
      onStateChange: function(event) {
        _this.onStateChange(event);
      }
    }
  });
  return true;
};

CRDS.JumbotronInlineVideoPlayer.prototype.bindEvents = function() {
  var _this = this;

  this.videoTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    _this.playVideo();
  }, true);

  this.closeButton.addEventListener('click', function(event) {
    event.preventDefault();
    _this.stopVideo();
  }, true);
};

CRDS.JumbotronInlineVideoPlayer.prototype.playVideo = function(event = null) {
  if (!this.player) {
    this.initVideo();
    return true;
  }
  this.playerContainerEl.classList.add('active');
};

CRDS.JumbotronInlineVideoPlayer.prototype.stopVideo = function() {
  this.playerContainerEl.classList.remove('active');
  this.player.stopVideo();
};

CRDS.JumbotronInlineVideoPlayer.prototype.onStateChange = function(event) {
  if (event.data == YT.PlayerState.ENDED) {
    this.stopVideo();
  }
};
