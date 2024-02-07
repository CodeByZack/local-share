const handleErr = (err)=>{
    console.error(err);
};

const setLocalAndSendMessage = (sessionDescription) => {
    log('setLocalAndSendMessage');
    RTC_PEER.peerConnect.setLocalDescription(sessionDescription);
    SOCKET_CLIENT.sendMessage(sessionDescription);
}

RTC_PEER = {
    config : {iceServers: [{urls: 'stun:stun.example.org'}]}
};

RTC_PEER.sendData = (msg)=>{
    RTC_PEER.dataChannel.send(msg);
};

RTC_PEER.createAnswer = ()=>{
    log('Sending answer to peer.');
    RTC_PEER.peerConnect.createAnswer(setLocalAndSendMessage,handleErr);
};

RTC_PEER.createOffer = ()=>{
    log('Creating Offer...');
    RTC_PEER.peerConnect.createOffer(setLocalAndSendMessage,handleErr);
};

RTC_PEER.createPeer = ()=>{
    const peerConnect = new RTCPeerConnection(RTC_PEER.config);
    RTC_PEER.peerConnect = peerConnect;
    RTC_PEER.registerHandler();
    if(GLOBAL.isRoomCreator){
        RTC_PEER.createDataChannel();
        RTC_PEER.createOffer();
    }
};

RTC_PEER.registerHandler = ()=>{
    const handleIceCandidate = (event)=>{
        log('handleIceCandidate event: ', event);
        if (event.candidate) {
            SOCKET_CLIENT.sendMessage({
              type: 'candidate',
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
            });
          } else {
            log('End of candidates.');
          }
    };
    const handleOnDataChannel = (event)=>{
        log('ondatachannel');
        RTC_PEER.dataChannel = event.channel;
        RTC_PEER.registerDataChannelHandler();
        RTC_PEER.sendData('FROM CALLEE===========');
    };
    RTC_PEER.peerConnect.onicecandidate = handleIceCandidate;
    if(!GLOBAL.isRoomCreator){
        RTC_PEER.peerConnect.ondatachannel = handleOnDataChannel;
    }
};

RTC_PEER.createDataChannel = ()=>{
    try {
        // Create a reliable data channel
        RTC_PEER.dataChannel = RTC_PEER.peerConnect.createDataChannel("sendDataChannel",{reliable: true});
    } catch (e) {
        console.error(e);
        alert('Failed to create data channel. ');
    }

    RTC_PEER.registerDataChannelHandler();
};

RTC_PEER.registerDataChannelHandler = ()=>{
    const handleDataChannelStateChange = ()=>{
        var readyState = RTC_PEER.dataChannel.readyState;
        log('Data channel state is: ' + readyState);
    };
    const handleDataChannelMessage = (event)=>{
        log(event.data);
    };
    RTC_PEER.dataChannel.onmessage = handleDataChannelMessage;
    RTC_PEER.dataChannel.onopen = handleDataChannelStateChange;
    RTC_PEER.dataChannel.onclose = handleDataChannelStateChange;
};

RTC_PEER.createReceiverPeer = (offerMsg)=>{
    RTC_PEER.createPeer();
    RTC_PEER.peerConnect.setRemoteDescription(new RTCSessionDescription(offerMsg));
    RTC_PEER.createAnswer();
};