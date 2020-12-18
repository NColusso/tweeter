/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//  helper function to create "safe" text that will not alter app
const escape = function(str) {
  let p = document.createElement('p')
  p.appendChild(document.createTextNode(str))
  return p.innerHTML
}

// alert message which will come up above compose tweet - parameter of error message
// will go away once user starts typing again
const alertMessage = function(error) {
  const div = document.createElement('div')
  const span = document.createElement('span');
  div.appendChild(span);
  span.appendChild(document.createTextNode(error));
  div.classList.add("error")
  $('.new-tweet').prepend(div);
  $("#tweet-text").on('keydown', function() {
    $(".error").remove();
  })
}

const createTweetElement = function(tweet) {
  
  const { name, avatars, handle } = tweet.user
  const content = tweet.content.text;
  const safeContent = escape(content)
  const time = tweet.created_at;
  const $tweet = `
  <article>
    <header>
      <div>
        <img src="${avatars}"><span class="name">${name}</span>
      </div>
      <span class="username">${handle}</span>
    </header>
    <p>${safeContent}</p>
    <footer>
      <span>${time}</span><span class="icons"> <i class="fas fa-flag"></i>  <i class="fas fa-retweet"></i>  <i class="fas fa-heart"></i> </span>
    </footer>
  </article>
  `
  return $tweet;
  
}

const loadTweets = function() {
  $.ajax("/tweets", {method: "GET"})
  .then((response) => {
    renderTweets(response)
  })
  .catch((error) => {
    alertMessage("Error loading tweets :(")
  })
}

const renderTweets = function(tweets) {
  // clear tweet container first to not have them show 2x
  $("#tweets-container").empty();
  for (const tweet of tweets) {
    const $newTweet = createTweetElement(tweet);
    $('#tweets-container').prepend($newTweet);
  }
}

const onSubmit = function(submit) {
  submit.preventDefault();
  const tweetContent = $(".new-tweet form textarea").val();
  const tweet = $(".new-tweet form").serialize();
  if (!tweetContent) {
    alertMessage("Please write your tweet First!")
  } else if (tweetContent.length > 140) {
    alertMessage("Please shorten to under 140 characters!")
  } else {
    $.ajax("/tweets", {method: "POST", data: tweet})
    .then((response) => {
      loadTweets() ;
      $(".new-tweet form textarea").val("");
      $(".counter").val(140);
    })
    .catch((error) => {
      alert("Error Submitting Tweet");
    })
  }
}


$(document).ready(function() {
  $(".new-tweet form").on('submit', onSubmit);
  loadTweets();
});