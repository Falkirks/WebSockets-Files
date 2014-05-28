var holder = document.getElementById('holder');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
document.getElementById('info').onclick = function () { alertify.alert('This application allows you to quickly send files via <a href="http://en.wikipedia.org/wiki/WebSocket"WebSockets">WebSockets</a> to a fake multicast session (data passes through server). Using socket.io this app is compatible with many different browsers (tested in Chrome and Desktop Safari). To join a differnt canvas just add /[Canvas Name] to the URL.') };
  var socket = io.connect('http://localhost:8080');
  socket.on('connect', function () {
    socket.on('disconnect', function () { alertify.error("Socket disconnected."); });
    socket.on('reconnecting',function() { location.reload() }); 
    socket.on('m',function(data) { 
      if(data.type == 1)  alertify.success(data.message);
      else if(data.type == 2)  alertify.error(data.message);
      else alertify.log(data.message); 
    }); 
    socket.on('error', function () { alertify.error("Unexpected error occured."); })
    socket.emit('join', { chan: window.location.pathname});
  	 var delivery = new Delivery(socket);
         alertify.success("Socket connected. Joined canvas: " + window.location.pathname);
      delivery.on('receive.start',function(fileUID){
        alertify.log("Starting file transfer.");
      });
    delivery.on('receive.success',function(file){
      console.log(file);
      alertify.set({ labels: {
    ok     : "Accept",
    cancel : "Deny"
    } });
      alertify.confirm("Accept new file with " + file.name, function (e) {
        if (e){
          alertify.log("Saving file.");
          setTimeout(function(){saveFile(file);}, 500);
        }
       });
      });
      holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  if(file.size == 0) alertify.error("Can't send folder.");
  else{
  alertify.log("Sending file.");
  delivery.send(file);
}
  console.log(file);
  return false;
};
  });
  function saveFile(blob) {
  var link = document.createElement('a');
  link.href = blob.dataURLPrefix + blob.data;
  link.download = blob.name;
  link.click();
};
