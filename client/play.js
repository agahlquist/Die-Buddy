"use strict";

var socket;
var user;

function handleSocketMessage(data) {

}

function init() {
  socket = io.connect();

  //listeners
  socket.on('connect', function() {
    socket.emit('join'/*, data*/);
  });
  
  socket.on('msg', function() {
    //chat functionality
  });
  
  $('.select').on('click', function() {
    //find char in database
    socket.emit('select-char');
  });
  
  $('.delete').on('click', function() {
    socket.emit('delete-char');
  });
  
}

window.onload = init;