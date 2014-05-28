var app = require('http').createServer(handler)
, io = require('socket.io').listen(app,{ log: false })
, dl  = require('delivery')
, fs = require('fs')
var clients = [];
app.listen(8080);
function handler (req, res) {
  if (req.url == "/favicon.ico") return;
  fs.readFile(__dirname + req.url, 
  function (err, data) {
    if(err){
  fs.readFile(__dirname + "/index.html", 
  function (err, data) {
        res.writeHead(200);
    res.end(data);

  });
}
    else{
    res.writeHead(200);
    res.end(data);
  }
  });
}
io.sockets.on('connection', function(socket) {
  console.log('Client Socket connected');
  socket.on('join', function(data) {
   sendMessage(data.chan, "New user has joined canvas", 1);
    var delivery = dl.listen(socket);
    console.log('Socket joined ' + data.chan);
    delivery.on('delivery.connect', function(delivery) {
      console.log('Delivery connected');
      pushClient(new Client(socket.id, data.chan, delivery, socket));
          socket.on('disconnect', function () {
            console.log("Client disconnected");
            sendMessage(data.chan, "User left channel", 2);
            clientDisconnect(socket.id);
         });
      delivery.on('receive.success', function(file) {
         socket.emit('m',{ message: 'File sent successfully', type: 1});
        fs.writeFile(__dirname + "/" + file.name, file.buffer, function(err) {
          if (err) console.log('File could not be saved.');
          else {
            for (var i = clients.length - 1; i >= 0; i--) if (clients[i].chan == data.chan && clients[i].id != socket.id) clients[i].d.send( {name: file.name, path : __dirname + '/' + file.name});
              fs.unlink(__dirname + '/' + file.name, function (err) {
                if (err) console.log("Error : " + err);
                else console.log('Successfully cleaned up transfer!');
            });
          };
        });
      });
    });
  });
});
function pushClient(c) {
  clients.push(c);
}
function Client (id, chan, d, s) {
  this.id = id;
  this.s = s;
  this.chan = chan;
  this.d = d;
  console.log("New client generated with  "+ id);
}
function sendMessage(chan,m,t){
   for (var i = clients.length - 1; i >= 0; i--) {
      if(clients[i].chan == chan) clients[i].s.emit('m', { message: m, type: t});
   };
}
function clientDisconnect(id){
   for (var i = clients.length - 1; i >= 0; i--) {
      if(clients[i].id == id){
         clients.remove(i);
         return;
      }
   };
}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

