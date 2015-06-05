$(function(){
  $('.filter-button').on('click', function(e) {
    $(this).next().toggle();
  });

  $(document).mouseup(function(e) {
    var container = $('.filter-list');

    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
    }
  });

});
