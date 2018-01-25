require('smoothscroll-polyfill').polyfill();

$(document).click('[data-smooth-scroll-to]', function(event) {
  event.preventDefault();
  var targetId = $(event.target).data('smooth-scroll-to');
  document.getElementById(targetId).scrollIntoView({
    behavior: 'smooth'
  });
});
