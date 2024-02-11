import { WebRTC } from "./core/webrtc";
import { GLOBAL, sendTextMessage } from "./main";
import { appState, appendMsg, updateFileProgress } from "./store";
import { showModal } from "./transfer-modal";
import { CONNECTION_STATE, ChunkType } from "../types/client";
import { SERVER_EVENT, ServerFn } from "../types/signaling";
import { WebRTCApi } from "../types/webrtc";
import {
  FILE_MAPPER,
  FILE_STATE,
  destructureChunk,
  getNextChunk,
  sendChunkMessage,
} from "./utils/binary";
import { isString } from "./utils/is";
import { TSON } from "./utils/tson";

const { closed, connectionState, peerId, msgList } = appState;

const onOpen = (event: Event) => {
  console.log("OnOpen", event);
  connectionState.val = CONNECTION_STATE.CONNECTED;
};

const onClose = (event: Event) => {
  console.log("OnClose", event);
  closed.val = true;
  peerId.val = "";
  msgList.val = [];
  connectionState.val = CONNECTION_STATE.READY;
};

const onError = (event: RTCErrorEvent) => {
  console.log("OnError", event);
};

const onJoinRoom: ServerFn<typeof SERVER_EVENT.JOINED_ROOM> = (member) => {
  console.log("JOIN ROOM", member);
  appState.devices.val = [...appState.devices.val, member];
};

const onJoinedMember: ServerFn<typeof SERVER_EVENT.JOINED_MEMBER> = (event) => {
  const { initialization } = event;
  console.log("JOINED MEMBER", initialization);
  appState.devices.val = [...initialization];
};

const onLeftRoom: ServerFn<typeof SERVER_EVENT.LEFT_ROOM> = (event) => {
  const { id } = event;
  console.log("LEFT ROOM", id);
  if (id === appState.peerId.val) {
    GLOBAL.webrtcHolder?.rtcInstance?.close();
    appState.closed.val = true;
    appState.peerId.val = "";
  }
  appState.devices.val = appState.devices.val.filter(
    (member) => member.id !== id
  );
};

const onReceiveOffer: ServerFn<typeof SERVER_EVENT.FORWARD_OFFER> = (event) => {
  const { origin } = event;
  appState.peerId.val = origin;
  showModal();
};

const onNotifyError: ServerFn<typeof SERVER_EVENT.NOTIFY_ERROR> = (_event) => {
  //   const { code, message } = event;
  // Message.error(message);
  // switch (code) {
  //   case ERROR_TYPE.PEER_BUSY:
  //     setState(CONNECTION_STATE.READY);
  //     break;
  // }
};

const onConnectionStateChange = (pc: RTCPeerConnection) => {
  switch (pc.connectionState) {
    case "new":
    case "connecting":
      connectionState.val = CONNECTION_STATE.CONNECTING;
      break;
    case "connected":
      connectionState.val = CONNECTION_STATE.CONNECTED;
      break;
    case "disconnected":
    case "closed":
    case "failed":
      connectionState.val = CONNECTION_STATE.READY;
      break;
  }
};

const onMessage = (event: MessageEvent<string | ChunkType>) => {
  console.log("onMessage", event);

  const { rtcInstance } = GLOBAL.webrtcHolder!;

  if (isString(event.data)) {
    // `String`
    const data = TSON.decode(event.data);
    if (!data) return void 0;
    if (data.type === "text") {
      appendMsg({ from: "peer", ...data });
    } else if (data.type === "file-start") {
      const { id, name, size, total } = data;
      FILE_STATE.set(id, { series: 0, ...data });
      sendTextMessage({ type: "file-next", id, series: 0, size, total });
      appendMsg({
        type: "file",
        from: "peer",
        name,
        size,
        progress: 0,
        id,
      });
    } else if (data.type === "file-next") {
      const { id, series, total } = data;
      const progress = Math.floor((series / total) * 100);
      updateFileProgress(id, progress);
      const nextChunk = getNextChunk(rtcInstance!, id, series);
      sendChunkMessage(rtcInstance!, nextChunk);
    } else if (data.type === "file-finish") {
      const { id } = data;
      FILE_STATE.delete(id);
      updateFileProgress(id, 100);
    }
  } else {
    // `Binary`
    const blob = event.data;
    destructureChunk(blob).then(({ id, series, data }) => {
      const state = FILE_STATE.get(id);
      if (!state) return void 0;
      const { size, total } = state;
      const progress = Math.floor((series / total) * 100);
      updateFileProgress(id, progress);
      if (series >= total) {
        sendTextMessage({ type: "file-finish", id });
      } else {
        const mapper = FILE_MAPPER.get(id) || [];
        mapper[series] = data;
        FILE_MAPPER.set(id, mapper);
        sendTextMessage({
          type: "file-next",
          id,
          series: series + 1,
          size,
          total,
        });
      }
    });
  }
  // onScroll(listRef);
};

export const initWebRTC = (wssUrl?: string) => {
  const holder: { webrtc?: WebRTC; rtcInstance?: WebRTCApi } = {};
  const webrtc = new WebRTC({ wss: wssUrl || location.href });
  webrtc.onOpen = onOpen;
  webrtc.onClose = onClose;
  webrtc.onError = onError;
  webrtc.onMessage = onMessage;
  webrtc.onConnectionStateChange = onConnectionStateChange;

  webrtc.signaling.on(SERVER_EVENT.JOINED_ROOM, onJoinRoom);
  webrtc.signaling.on(SERVER_EVENT.JOINED_MEMBER, onJoinedMember);
  webrtc.signaling.on(SERVER_EVENT.LEFT_ROOM, onLeftRoom);
  webrtc.signaling.on(SERVER_EVENT.FORWARD_OFFER, onReceiveOffer);
  webrtc.signaling.on(SERVER_EVENT.NOTIFY_ERROR, onNotifyError);
  webrtc.onReady = ({ rtc }) => {
    holder.rtcInstance = rtc;
    appState.connectionState.val = CONNECTION_STATE.READY;
  };
  appState.localId.val = webrtc.id;
  holder.webrtc = webrtc;
  return holder;
};

export const destroyWebRTC = (webrtc: WebRTC) => {
  webrtc.signaling.off(SERVER_EVENT.JOINED_ROOM, onJoinRoom);
  webrtc.signaling.off(SERVER_EVENT.JOINED_MEMBER, onJoinedMember);
  webrtc.signaling.off(SERVER_EVENT.LEFT_ROOM, onLeftRoom);
  webrtc.signaling.off(SERVER_EVENT.FORWARD_OFFER, onReceiveOffer);
  webrtc.signaling.off(SERVER_EVENT.NOTIFY_ERROR, onNotifyError);
  webrtc.destroy();
};
