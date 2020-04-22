const express=require('express')
const socketIO=require('socket.io')
const PORT= process.env.PORT || 3000;
const INDEX= '/index.html'
var map={}
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  const io = socketIO(server);

  function messageHandler(message){
      console.log(message.iceCandidate);
      if(message.offer||message.answer){
          console.log("hello saurav");
          io.to(map[message.remoteId]).emit('message',message);
      }
      else if(message.iceCandidate){
          console.log("hello candidate");
          io.to(map[message.remoteId]).emit('message',message);
      }
    // io.emit("message",message);
  }
  let z;
  io.on('connection', (socket) => {
    console.log('Client connected');
    console.log(socket.id);
    z=socket.id;
    socket.on('message',messageHandler);
    socket.on('userid',(uid)=>{map[uid]=socket.id; console.log(map)});
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

//   io.to('98518').emit('message','hello world');
// io.emit('message','saurav')
//   setInterval(() => io.to(map['98518']).emit('message','hello world'), 10000);