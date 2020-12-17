/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function(str) {
  let p = document.createElement('p')
  p.appendChild(document.createTextNode(str))
  console.log(p.innerHTML)
  return p.innerHTML
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
  <span>${time}</span><span>f r h</span>
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
    console.log("error")
  })
}

const renderTweets = function(tweets) {
  // const orderedTweets = tweets.reverse()
  for (const tweet of tweets) {
    const $newTweet = createTweetElement(tweet)
    $('#tweets-container').prepend($newTweet);
  }
}

const onSubmit = function(submit) {
  submit.preventDefault()
  const tweetContent = $(".new-tweet form textarea").val()
  const tweet = $(".new-tweet form").serialize()
  if (!tweetContent) {
    alert("Please write your tweet first!")
  } else if (tweetContent.length > 140) {
    alert("Tweet too long! Please shorten to under 140 characters")
  } else {
    $.ajax("/tweets", {method: "POST", data: tweet})
    .then((response) => {
      loadTweets() 
      $(".new-tweet form textarea").val("")
      $(".counter").val(140)
    })
    .catch((error) => {
      alert("Error Submitting Tweet")
    })
  }
}


$(document).ready(function() {
  $(".new-tweet form").on('submit', onSubmit)
  loadTweets()
});