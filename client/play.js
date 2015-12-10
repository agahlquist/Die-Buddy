"use strict";

var socket;
var room = '';

function handleSocketMessage(data) {

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
    });
  });
  
  $('#closeJoinArea').on('click', function() {
    $('#joinArea').animate({
      top: '-500'
    });
  });
  
  $('#connectButton').on('click', function(e) {
    e.preventDefault();
    if($('#joinCode').val() == '' || $('#joinCode').val().length < 4) alert('Input a room code!');
    
    var rc = $('#joinCode').val();
    var sendData = {
      room: rc,
      id: socket.id
    };
    
    //socket.emit('player join', sendData);
  });
  
  //Sockets
  socket.on('connect', function() {
    //user + room
    console.log('socket connected');
  });
  
  socket.on('hostRoom', function(data) {
    console.log('Room: ' + data.room);
    
    room = data.room;
    $('.navtitle').text('Room: ' + room);
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