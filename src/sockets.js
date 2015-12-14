var models = require('./models');

var io;
var rooms = {};
var users = {};

var configureSockets = function(socketio) {
  io = socketio;

  io.sockets.on('connection', function(socket) {
    users[socket.id] = {
      socket: socket,
      room: undefined,
      host: undefined,
      rolling: false,
      activeChar: {
        name: 'bruh' + Math.floor((Math.random() * 999) + 1),
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0
      }
    };
    var dumb = users[socket.id].activeChar.name;
    io.to(socket.id).emit('dumbupdate', dumb);

    socket.on('connectHost', function() {
      var r = '';

      while(r === '' || rooms[r] !== undefined) {
        r = generateRoomKey();
      }

      rooms[r] = {
        players: 0
      };

      var data = { room: r };

      socket.join(r);

      rooms[data.room].players++;
      users[socket.id].room = r;
      users[socket.id].host = true;

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
        users[socket.id].room = data.room;
        users[socket.id].host = false;

        socket.join(data.room);
        updatePartyList(data.room);
        
        io.to(socket.id).emit('player connect', data);
      } else {
        console.log('room ' + data.room + ' full');
      }
    });

    socket.on('select char', function(data) {
      console.log('selected char: ' + data.name);
      users[socket.id].activeChar = data;
      
      if(users[socket.id].room) updatePartyList(users[socket.id].room);
    });

    socket.on('disconnect', function(data) {
      console.log(/*data.name + */'disconnected');
      
      var r = users[socket.id].room;
      if(users[socket.id]) {
        if(rooms[users[socket.id].room]) rooms[users[socket.id].room].players--;
        delete users[socket.id];
      }
      
      if(r) {
        updatePartyList(r);
      }
    });

    socket.on('roll', function(data) {
      console.log(data);
      var sum = 0;
      var msg = '';
      
      msg += users[socket.id].activeChar.name + ' rolled';
      
      for(var die in data) {
        console.log('==================');
        console.log('sum before ' + die + ': ' + sum);
        if(data[die].num > 0) {
          var d = roll(data[die].sides, data[die].num);
          sum += d;
          
          msg += ' ' + data[die].num + ' ' + die;
          console.log('sum after ' + die + ': ' + sum);
        }
      }
      msg += ' for a total of: ' + sum;
      console.log(msg);
      console.log('roll sum: ' + sum);
      
      if(users[socket.id].room) io.to(users[socket.id].room).emit('msg', msg);
      else io.to(socket.id).emit('msg', msg);
    });

    socket.on('chat', function(data) {
      console.log('recieved: ' + data);
      var sendData;
      
      sendData = users[socket.id].activeChar.name + ': ' + data;
      
      if(users[socket.id].room) io.to(users[socket.id].room).emit('msg', sendData);
      else io.to(socket.id).emit('msg', sendData)
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

function updatePartyList(room) {
  var partyMembers = {};
  
  for(var user in users) {
    if(users[user].room == room) {
      partyMembers[users[user].socket.id] = {
        socketid: users[user].socket.id,
        room: users[user].room,
        host: users[user].host,
        rolling: users[user].rolling,
        activeChar: users[user].activeChar
      };
    }
  }
  
  io.to(room).emit('update party', partyMembers);
}

function roll(sides, num) {
  var rolled = 0;
  
  for(var i = 0; i < num; i++) {
    var r = Math.floor((Math.random() * sides) + 1);
    console.log('rolled: ' + r);
    
    rolled += r;
  }
  
  return rolled;
}


module.exports.configureSockets = configureSockets;