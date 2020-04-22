<!DOCTYPE html>
<html>
  <head>
    <title>HostServer</title>
    <script src="socket.io/socket.io.js"></script>
    <script>
      // const io = require('socket.io-client')('http://localhost:3000')
      //   const selfView=document.querySelector("video#myVideo");
    //   let localId="13839";
    //   let remoteId="98518";

      let localId="98518";
      let remoteId="13839";
      io = io();
      io.on("connect", (socket) => {
        console.log("sucessfully connected");
        io.emit('userid',localId);
      });
      io.on("disconnect", () => console.log("disconnected..."));
      //   socket.emit("messages", "{'saurav','gaurav'}");
      //   socket.on("message", (val) => console.log("Message Recieved: ", val));
      async function makeCall() {
        const configuration = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };
        let localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        const peerConnection =await new RTCPeerConnection(configuration);
        localStream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track,localStream);
            selfView.srcObject=localStream;
        })
        io.on("message", async (message) => {
          console.log("answer has come");
          if (message.answer) {
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
          }
        });
        // Listen for local ICE candidates on the local RTCPeerConnection
        peerConnection.onicecandidate=(event) => {
            console.log(event);
          if (event.candidate) {
            io.emit('message',{remoteId:remoteId, iceCandidate: event.candidate });
          }
        };
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        io.emit("message", {remoteId:remoteId, offer: offer });
      }
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      const peerConnection = new RTCPeerConnection(configuration);
      io.on("message", async (message) => {
        console.log(message);
        if (message.offer) {
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          io.emit("message", {remoteId:remoteId, answer: answer });
        }
      });

      io.on('message', async message => {
          console.log(message);
    if (message.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
    //   makeCall();
    </script>
  </head>
  <body>
    <h1>HostServer</h1>
    <video autoplay id="selfView"></video>
    <button onclick="makeCall()">Call Now</button>
    <video autoplay id="remoteView"></video>
  </body>
</html>
