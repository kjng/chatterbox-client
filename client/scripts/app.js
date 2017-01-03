// filterXSS usage:
// filterXSS('<script>alert("xss");</scr' + 'ipt>')
// $(document).ready(function() {

var app = {
  messages: [],
  username: '',

  server: 'https://api.parse.com/1/classes/messages',

  init: function() {
    // debugger;
    app.username = filterXSS(window.location.search.slice(window.location.search.lastIndexOf('=') + 1));
    $('h1').after('<h2>Hi ' + app.username + '!</h2>');

    this.fetch();
    // var showMessages = function(dataArray) {
    _.each(app.messages.reverse(), function(dataObj) {
      //create DOM node
      app.renderMessage(dataObj);
      //append node to #chats

    });
    // };
    $('#send .submit').on('click', function() {
      app.handleSubmit();
    });

  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

  },

  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      async: false,
      type: 'GET',
      success: function(data) {
        console.log('chatterbox: Messages received');
        app.messages = data.results;
      },
      error: function() {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive messages');
      }
    });

  },

  clearMessages: function() {
    $('#chats').html('');
  },

  renderMessage: function(dataObj) {
    var $post = $('<div class="post"></div>');
    var $username = filterXSS(dataObj.username);
    var $text = filterXSS(dataObj.text);

    $post.html('<div class="username">Username: ' +
      $username + '</div><div class="text">Message: ' +
      $text + '</div>');

    $('#chats').prepend($post);
  },

  renderRoom: function() {},

  handleUsernameClick: function() {},

  handleSubmit: function() {
    //call app.send(message);
    //once we get the text from the the input box
    // var message = {
    //   username: 'shawndrost',
    //   text: 'trololo',
    //   roomname: '4chan'
    // };

    var message = {
      username: app.username,
      text: $('#message').val(),
      roomname: 'funkyDefault'
    };

    app.send(message);
    app.renderMessage(message);
  }
};

// app.fetch();
app.init();

// });



// dropdown to select the room - list of rooms available

//       input text box

//       submit button

// var $messages = $.get('https://api.parse.com/1/classes/messages');