"use strict";

var socket;
var room = '';

function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    dataType: 'json',
    success: function(result, status, xhr) {

    },
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      alert(messageObj.error);
    }
  });
}

function init() {
  socket = io.connect();

  //Buttons
  $('#hostButton').on('click', function() {
    socket.emit('connectHost');
  });

  $('#joinButton').on('click', function() {
    $('#joinArea').animate({
      top: '0'
    }, 400, function() {
      $('.overlay').css({ 'visibility': 'visible' })
    });
  });

  $('#closeJoinArea').on('click', function() {
    $('#joinArea').animate({
      top: '-500'
    }, 400, function() {
      $('.overlay').css({ 'visibility': 'hidden' })
    });
  });

  $('#connectButton').on('click', function(e) {
    e.preventDefault();
    if($('#joinCode').val() == '' || $('#joinCode').val().length < 4) {
      alert('Input a room code!');
      return;
    }

    var rc = $('#joinCode').val().toUpperCase();
    var sendData = {
      room: rc,
      id: -1
    };

    $('#joinArea').animate({
      top: '-500'
    }, 400, function() {
      $('.overlay').css({ 'visibility': 'hidden' })
    });

    socket.emit('player join', sendData);
  });
  
  $('#chatBox').keypress(function(e) {
    if(e.keyCode == 13) sendMessage($('#chatBox').val().trim());
  });
  $('#chatButton').on('click', function() {
    sendMessage($('#chatBox').val().trim());
  });
  
  $('#rollButton').on('click', function() {
    if(($('#d4input').val() == 0 || $('d4input').val() == '') &&
       ($('#d6input').val() == 0 || $('d6input').val() == '') &&
       ($('#d8input').val() == 0 || $('d8input').val() == '') &&
       ($('#d10input').val() == 0 || $('d10input').val() == '') &&
       ($('#d12input').val() == 0 || $('d12input').val() == '') &&
       ($('#d20input').val() == 0 || $('d20input').val() == '')) {
      alert('Select some die!');
      return;
    }
    
    var rollData = {
      d4: {
        sides: 4,
        num: $('#d4input').val()
      },
      d6: {
        sides: 6,
        num: $('#d6input').val()
      },
      d8: {
        sides: 8,
        num: $('#d8input').val()
      },
      d10: {
        sides: 10,
        num: $('#d10input').val()
      },
      d12: {
        sides: 12,
        num: $('#d12input').val()
      },
      d20: {
        sides: 20,
        num: $('#d20input').val()
      }
    };
    
    socket.emit('roll', rollData);
  });

  //Sockets
  socket.on('connect', function() {
    console.log('socket connected');
  });
  
  socket.on('dumbupdate', function(data) {
    var before = '<div class="emptyActive">' +
                 '<p>You are</p>' +
                 '<p class="em">' + data + '</p>';
    $(before).insertBefore('.emptyActive');
  });

  socket.on('hostRoom', function(data) {
    room = data.room;
    $('.navtitle').text('Room: ' + room);
    $('#chatLog').html('');
  });

  socket.on('player connect', function(data) {
    if(data.id !== -1) {
      room = data.room;
      $('.navtitle').text('Room: ' + room);
      $('#chatLog').html('');
    } else {
      alert('Room not found!');
    }
  });

  socket.on('update party', function(data) {
    $('#partyMembers').html('');

    for(var key in data) {
      if(data[key].socketid !== socket.id) {
        $('#partyMembers').append('<div class="partymember">' +
                                  '<p class="partymemberName">' + data[key].activeChar.name + '</p>' +
                                  '</div>');
      } else if(data[key].activeChar == undefined) {
        $('#partyMembers').append('<div class="partymember">' +
                                  '<p>' + 'undefined' + '</p>' +
                                  '</div>');
      }
    }
  });

  socket.on('msg', function(msg) {
    $('#chatLog').append('<p class="chatMsg">' + msg + '</p>');
    var log = document.querySelector('#chatLog');
    log.scrollTop = log.scrollHeight;
  });
}

function sendMessage(msg) {
  if(msg !== '') socket.emit('chat', msg);
  $('#chatBox').val('');
}

window.onload = init;