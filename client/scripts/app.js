// filterXSS usage:
// filterXSS('<script>alert("xss");</scr' + 'ipt>')
// $(document).ready(function() {

var app = {
  messages: [],
  username: '',
  server: 'https://api.parse.com/1/classes/messages',
  rooms: {},
  friends: {},
  currentRoom: 'Show All Messages',
  init: function() {
    // debugger;
    app.username = filterXSS(window.location.search.slice(window.location.search.lastIndexOf('=') + 1));
    $('h1').after('<h2>Hi ' + app.username + '!</h2>');

    app.fetch();

    $('#send .submit').on('click', function() {
      app.handleSubmit();
    });

    $('#roomSelect').on('change', function() {
      app.currentRoom = $('#roomSelect option:selected').val();
      app.renderRoom();
    });

    $('#createRoom').on('click', function(event) {
      var newRoom = prompt('Please enter your room name:');

      //add it to the dropdown
      var cleanRoom = filterXSS(newRoom);
      var id = cleanRoom.replace(/ /g, '');
      if ($('#' + id).length === 0) {
        $('#roomSelect').append('<option id=' + id + '>' + cleanRoom + '</option>');
      }

      event.preventDefault();
    });

    $('#updatePosts').on('click', function(event) {
      //setInterval(function() {
      app.fetch();
      setTimeout(function() {
        app.renderRoom();
      }, 200);
      // }, 3000);
      event.preventDefault();
    });

    $('#chats').on('click', '.username', app.handleUsernameClick);
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
      //async: false,
      type: 'GET',
      success: function(data) {
        console.log('chatterbox: Messages received');
        app.messages = data.results;
        _.each(data.results.reverse(), function(dataObj) {
          var room = dataObj.roomname;
          if (room) {
            app.rooms[room] = room;
          }
          app.renderMessage(dataObj);
        });
        _.each(app.rooms, function(room) {
          var cleanRoom = filterXSS(room);
          var id = cleanRoom.replace(/ /g, '');
          if ($('#' + id).length === 0) {
            $('#roomSelect').append('<option id=' + id + '>' + cleanRoom + '</option>');
          }
        });

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
    var $post = $('<div class="post ' + dataObj.roomname + '"></div>');
    var $roomname = filterXSS(dataObj.roomname);
    var $username = filterXSS(dataObj.username);
    var $text = filterXSS(dataObj.text);

    $post.html('<div class="roomname" data-roomname="' +
      $roomname + '">Room: ' +
      $roomname + '</div><div class="username" data-username="' +
      $username + '">Username: ' +
      $username + '</div><div class="text">Message: ' +
      $text + '</div>');

    $('#chats').prepend($post);

    if (app.friends[$username]) {
      $('.username:contains(' + $username + ')').addClass('friend');
    }
  },

  renderRoom: function() {
    app.clearMessages();
    //re-render messages for just this room
    if ($('#roomSelect option:selected').val() === 'Show All Messages') {
      app.fetch();
    }
    app.messages.forEach(function(msg) {
      if (msg.roomname === app.currentRoom) {
        app.renderMessage(msg);
      }
    });
  },

  handleUsernameClick: function(event) {
    var friend = $(event.target).data('username');
    app.friends[friend] = friend;
    $('.username:contains(' + friend + ')').addClass('friend');
  },

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
      roomname: app.currentRoom
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