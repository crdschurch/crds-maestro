require('smoothscroll-polyfill').polyfill();

$(document).ready(function(event) {
  $('[data-smooth-scroll-to]').click(function(event) {
    event.preventDefault();
    var targetId = $(this).data('smooth-scroll-to');
    var target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    return true;
  });
});
