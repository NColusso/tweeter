$(document).ready(function() {
  $("#tweet-text").on('input', onChange);
});

const onChange = function(){ 
  const text = $(this).val();
  const remaining = 140 - text.length;
  const parent = $(this).parent();
  const counter = parent.find(".counter")
  counter.text(remaining);
  if (remaining < 0) {
    counter.addClass("color-warning");
  } else {
    counter.removeClass("color-warning")
  }
};