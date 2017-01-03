// YOUR CODE HERE:

// filterXSS usage:
// filterXSS('<script>alert("xss");</scr' + 'ipt>')


// dropdown to select the room - list of rooms available

//       input text box

//       submit button

// var $messages = $.get('https://api.parse.com/1/classes/messages');
var $messages = $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'GET',
  success: function(data) {
    console.log('chatterbox: Messages received');
    showMessages(data.results);
  },
  error: function() {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to receive messages');
  }
});


var showMessages = function(dataArray) {
  _.each(dataArray, function(dataObj) {
    //create DOM node
    var $post = $('<div class="post"></div>');
    var $username = filterXSS(dataObj.username);
    var $text = filterXSS(dataObj.text);

    $post.html('<div class="username">' +
      $username + '</div><div class="text">' +
      $text + '</div>');
    //append node to #chats
    $('#chats').append($post);
  });
};

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

////  POST

// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'https://api.parse.com/1/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function(data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function(data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });