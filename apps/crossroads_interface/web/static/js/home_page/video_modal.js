window['CRDS'] = window['CRDS'] || {};

CRDS.VideoModal = {}

$(document).ready(function() {
  $('.modal.video-modal').on('show.bs.modal', function(event) {
    var iframe = $(this).find('iframe');
    iframe.attr('src', iframe.data('src'));
  });
  $('.modal.video-modal').on('hidden.bs.modal', function(event) {
    var iframe = $(this).find('iframe');
    iframe.removeAttr('src');
  });
});
