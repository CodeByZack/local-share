const SOCKET_CLIENT = {
    serverUrl : 'http://localhost:3000',
};

SOCKET_CLIENT.createSocketIo = ()=>{
    const socket = io(SOCKET_CLIENT.serverUrl);
    SOCKET_CLIENT.socket = socket;
    SOCKET_CLIENT.registerHandler();
};

SOCKET_CLIENT.registerHandler = () => {
    const handleConnect = ()=>{
        log(SOCKET_CLIENT.socket.id);
        SOCKET_CLIENT.socket.emit('create or join', GLOBAL.channel);
    };
    const handleDisconnect = ()=>{
        log(SOCKET_CLIENT.socket.id);
    };
    const handleCreated = (channel)=>{
        GLOBAL.isRoomCreator = true;
        log('channel ' + channel + ' has been created!');
        log('This peer is the caller...');
    };
    const handleMessage = (message)=>{
        log('Received message:', message);
        if (message.type === 'offer') {
            if (!GLOBAL.isRoomCreator) {
                RTC_PEER.createReceiverPeer(message);
            }
        } else if (message.type === 'answer' && RTC_PEER.peerConnect) {
            RTC_PEER.peerConnect.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate' && RTC_PEER.peerConnect) {
            const candidate = new RTCIceCandidate({sdpMLineIndex:message.label,candidate:message.candidate});
            RTC_PEER.peerConnect.addIceCandidate(candidate);
        }
    };
    const handleRemotePeerJoining = ()=>{
        if(GLOBAL.isRoomCreator){
            log('有人加入房间了：创建RTCPeer。。。');
            RTC_PEER.createPeer();
        }
    };

    SOCKET_CLIENT.socket.on('message',handleMessage);
    SOCKET_CLIENT.socket.on('remotePeerJoining',handleRemotePeerJoining);
    SOCKET_CLIENT.socket.on('created',handleCreated);
    SOCKET_CLIENT.socket.on('disconnect',handleDisconnect);
    SOCKET_CLIENT.socket.on('connect',handleConnect);
};

SOCKET_CLIENT.sendMessage = (message)=>{
    SOCKET_CLIENT.socket.emit('message', {...message,channel: GLOBAL.channel });
};

SOCKET_CLIENT.joinRoom = ()=>{
    SOCKET_CLIENT.createSocketIo();
};