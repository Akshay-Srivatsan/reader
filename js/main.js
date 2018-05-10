/*
  * Totality Application Reader
  * Written by Gautam Mittal
  * April 2018
*/

const AUTH_TOKEN = localStorage.getItem('token')

let application = {}

function getApplication() {
  $.ajax({
    type:"GET",
    url: HOST + "/reader/next_application/",
    dataType: "json",
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN);
    }
  }).done(function(data) {
    application = data
    load()
  }).fail(function(data) {
    console.log(data.responseText)
  });
}

function submitReview() {
  var params = {
        "application": application.id,
        "rating_number": parseInt($('#rating').val(), 10),
        "comments": $('#comments').val()
  };
  $.ajax({
    type:"POST",
    url: HOST + "/reader/rating/",
    dataType: "json",
    data: params,
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN);
    }
  }).done(function(data) {
    console.log(data)
    window.location = "/"
  }).fail(function(data) {
    console.log(data.responseText)
  });
}

function load() {
  $("#github").text(`@${application.github_username}`)
  for (var i = 0; i < application.questions.length; i++) {
    $("#container").append(`<div class="question">
      <h3>${application.questions[i][0]}</h3>
      <p>${application.questions[i][1].replaceAll(/\n/g, '<br />')}</p>
    </div>`)
  }
}

function logout() {
    localStorage.removeItem('token');
    window.location = '/login';
}

$('#logout').click(logout);
$('#submitReview').click(submitReview);

$(document).ready(() => {
  if (AUTH_TOKEN == null)
    window.location = "/login"
  getApplication()
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
