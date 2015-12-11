"use strict";

var socket;
var room = '';

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
    
    var rc = $('#joinCode').val().toUpperCase();
    var sendData = {
      room: rc,
      id: -1
    };
    
    $('#joinArea').animate({
      top: '-500'
    });
    
    socket.emit('player join', sendData);
  });
  
  $('.select').on('click', function() {
    //find char in database
    socket.emit('select-char');
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
  
  socket.on('player connect', function(data) {
    if(data.id !== -1) {
      room = data.room;
      $('.navtitle').text('Room: ' + room);
      
      console.log('joined room: ' + data.room);
      console.log(data.party);
    } else {
      alert('Room not found!');
    }
  });
  
  socket.on('msg', function() {
    //chat functionality
  });
}

window.onload = init;