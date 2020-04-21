// navigator.mediaDevices.getDisplayMedia({cursor: 'always' | 'motion' | 'never',
// displaySurface: 'application' | 'browser' | 'monitor' | 'window'}).then(
//     stream=>{
//         var videoElement=document.querySelector('video#myVideo')
//         videoElement.srcObject=stream;
//     }
// , error=>console.log("We need permission to start"))

// async function getConnectedDevices(type){
//     const devices=await navigator.mediaDevices.enumerateDevices();
//     return devices.filter(device=>device.kind===type);
// }

// async function openCamera(cameraId, minWidth,minHeight)
// {
//     const constraint={
//         video:true,
//         audio:{'echoCancellation':true},
//     }
//     return await navigator.mediaDevices.getUserMedia(constraint)
// }

// getConnectedDevices('videoinput').then((cameras)=>{console.log(cameras[0])
// if(cameras && cameras.length>0){
//     openCamera(cameras[0].deviceId,1280,720).then(value=>{
//         var videoElement=document.querySelector('video#myVideo')
//         videoElement.srcObject=value;
//     }
// , error=>console.log("We need permission to start"));
// }
// });

async function makeCall() {
    const configuration={'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onnegotiationneeded
    signalingChannel.addEventListener('message', async message => {
        if (message.answer) {
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        }
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(peerConnection);
    signalingChannel.send({'offer': offer});
}


signalingChannel.addEventListener('message', async message=>{
    if(message.offer){
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer=await peerConnection.createAnswer();
        console.log(answer);
        await peerConnection.setLocalDescription(answer);
        signalingChannel.send({'answer':answer});
    }
})
