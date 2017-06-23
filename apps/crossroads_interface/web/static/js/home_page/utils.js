window['CRDS'] = window['CRDS'] || {};

CRDS.Utils = function() {};

CRDS.Utils.__bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

CRDS.Utils.loadScript = function(url, callback) {
  var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onreadystatechange = callback;
      script.onload = callback;
  var head = document.getElementsByTagName('head')[0];
      head.appendChild(script);
}