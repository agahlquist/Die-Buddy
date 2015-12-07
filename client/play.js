"use strict";

var socket;
var room = '';

function handleSocketMessage(data) {

}

function init() {
  socket = io.connect();
  
  //listeners
  socket.on('connect', function() {
    //user + room
    socket.emit('connectHost');
  });
  
  socket.on('hostRoom', function(data) {
    console.log('Room: ' + data.room);
    
    room = data.room;
    $('#roomCode').text('Room: ' + room);
  });
  
  socket.on('msg', function() {
    //chat functionality
  });
  
  $('.select').on('click', function() {
    //find char in database
    socket.emit('select-char');
  });
}

window.onload = init;