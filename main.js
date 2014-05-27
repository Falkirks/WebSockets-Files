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
  console.log('Socket connected');
  socket.on('join', function(data) {
    var delivery = dl.listen(socket);
    console.log('Socket joined ' + data.chan);
    delivery.on('delivery.connect', function(delivery) {
      console.log('Delivery connected');
      pushClient(new Client(socket.id, data.chan, delivery));
      delivery.on('receive.success', function(file) {
        fs.writeFile(__dirname + "/" + file.name, file.buffer, function(err) {
          if (err) {
            console.log('File could not be saved.');
          }
          else {
            for (var i = clients.length - 1; i >= 0; i--) if (clients[i].chan == data.chan && clients[i].id != socket.id) clients[i].d.send( {name: file.name, path : __dirname + '/' + file.name});
              fs.unlink(__dirname + '/' + file.name, function (err) {
                if (err) console.log("Erorr : " + err);
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
function Client (id, chan, d) {
  this.id = id;
  this.chan = chan;
  this.d = d;
  console.log("Client constructor called "+ id);
}

