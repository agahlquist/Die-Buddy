var io;
var rooms = {};
var users = {};

//figure room shit

var configureSockets = function(socketio) {
  io = socketio;
  
  io.sockets.on('connection', function(socket) {
    socket.on('connectHost', function() {
      var r = '';
      
      while(r === '' || rooms[r] !== undefined) {
        r = generateRoomKey();
      }
      
      rooms[r] = {
        players: 0
      };
      
      var data = { room: r };
      console.log(r);
      
      socket.join(r);
      
      io.to(socket.id).emit('hostRoom', data);
    });
    
    socket.on('player join', function(data) {
      if(rooms[data.room] === undefined) {
        console.log('no room ' + data.room);
        io.to(socket.id).emit('player connect', data);
        return;
      }
      
      if(data.id === -1 && rooms[data.room].players <= 6) {
        data.id = socket.id;
        rooms[data.room].players++;
        users[socket.id] = {
          socket: socket,
          room: data.room
        };
        
        io.to(socket.id).emit('player connect', data);
        socket.join(data.room);
      } else {
        console.log('room ' + data.room + ' full');
      }
    });
    
    socket.on('disconnect', function(data) {
      console.log(/*data.name + */'disconnected');
      
      if(users[socket.id]) {
        rooms[users[socket/id].room].players--;
        delete users[socket.id];
      }
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

function generateRoomKey() {
  var pw = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var keyLength = 4;
  
  for(var i = 0; i < keyLength; i++) {
    var rchar = Math.floor(Math.random() * chars.length);
    pw += chars.substring(rchar, rchar+1);
  }
  
  return pw;
}


module.exports.configureSockets = configureSockets;