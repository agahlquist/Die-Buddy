var io;
var rooms = {};
var users = {};

//figure room shit

var configureSockets = function(socketio) {
  io = socketio;
  
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
      console.log('connected');
      //data.roomcode?
      //socket.join('');
    });
    
    socket.on('disconnect', function(data) {
      console.log('disconnected');
      //data.roomcode?
      //socket.leave('');
    });
    
    socket.on('select-char', function(data) {
      console.log('char selected');
    });
    
    socket.on('delete-char', function(data) {
      console.log('char deleted');
    });
    
    socket.on('roll', function(data) {
      
    });
    
    socket.on('chat', function(data) {
      
    });
  });
};


module.exports.configureSockets = configureSockets;