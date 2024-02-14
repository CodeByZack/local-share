import { drawingBackdrop } from "./components/backdrop";
import App from "./app";
import "./index.less";
import van from "vanjs-core";
import { destroyWebRTC, initWebRTC } from "./initWebRTC";
import { CONNECTION_STATE, TextMessageType } from "../types/client";
import { TSON } from "./utils/tson";
import { WebRTC } from "./core/webrtc";
import { WebRTCApi } from "../types/webrtc";
import { appState } from "./store";

export const GLOBAL: { webrtc?: WebRTC; rtcInstance?: WebRTCApi } = {};

export const sendTextMessage = (message: TextMessageType) => {
  if (!GLOBAL.rtcInstance) return;
  GLOBAL.rtcInstance.send(TSON.encode(message));
};

const clear = () => {
  if (GLOBAL.webrtc) {
    destroyWebRTC(GLOBAL.webrtc!);
  }
};

const init = () => {
  drawingBackdrop();
  GLOBAL.webrtc = initWebRTC();
  GLOBAL.webrtc.onReady = ({ rtc }) => {
    GLOBAL.rtcInstance = rtc;
    appState.connectionState.val = CONNECTION_STATE.READY;
  };
  appState.localId.val = GLOBAL.webrtc.id;
  van.add(document.getElementById("root")!, App());
};

window.addEventListener("DOMContentLoaded", init);

window.addEventListener("beforeunload", clear);
