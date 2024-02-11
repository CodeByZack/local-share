import { drawingBackdrop } from "./components/backdrop";
import App from "./app";
import "./index.less";
import van from "vanjs-core";
import { destroyWebRTC, initWebRTC } from "./initWebRTC";
import { TextMessageType } from "../types/client";
import { TSON } from "./utils/tson";
import { WebRTC } from "./core/webrtc";
import { WebRTCApi } from "../types/webrtc";

export const GLOBAL: {
  webrtcHolder?: { webrtc?: WebRTC; rtcInstance?: WebRTCApi };
} = {};

export const sendTextMessage = (message: TextMessageType) => {
  GLOBAL.webrtcHolder?.rtcInstance?.send(TSON.encode(message));
};

const clear = () => {
  console.log("before unload");
  if (GLOBAL.webrtcHolder) {
    destroyWebRTC(GLOBAL.webrtcHolder.webrtc!);
  }
};

const init = () => {
  drawingBackdrop();
  GLOBAL.webrtcHolder = initWebRTC();
  van.add(document.getElementById("root")!, App());
};

window.addEventListener("DOMContentLoaded", init);

window.addEventListener("beforeunload", clear);
