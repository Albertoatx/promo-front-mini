// Moved this from 'index.html' because caused problems when using DEFER 
// because it tried to execute BEFORE jquery was loaded and gave the next message
// "(index):229 Uncaught ReferenceError: $ is not defined"
$(function () {

  //active-desactivate navbar 
  $('#js-navbar-collapse li').on("click", function () {
    $('#js-navbar-collapse li').removeClass("active");
    $(this).addClass("active");
  });

  //tooltip
  $('[data-toogle="tooltip"]').tooltip();
});
