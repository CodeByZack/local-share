import van from "vanjs-core";
import styles from "./index.module.less";
import { appState, appendMsg } from "../store";
import { CrossIcon, FileIcon, SendIcon } from "./icon";
import { CONNECTION_STATE } from "../../types/client";
import Button from "./base/button";
import { MessageList } from "./message-list";
import { GLOBAL, sendTextMessage } from "../main";
import { FILE_SOURCE, ID_SIZE, getMaxMessageSize } from "../utils/binary";
import { getUniqueId } from "../utils/uuid";

const { span, div, input } = van.tags;
const { closed, connectionState, peerId, msgList } = appState;

const TITLE_DOT_COLOR = {
  [CONNECTION_STATE.READY]: "rgb(245,63,63)",
  [CONNECTION_STATE.CONNECTED]: "rgb(0,180,42)",
  [CONNECTION_STATE.CONNECTING]: "rgb(247,114,52)",
  [CONNECTION_STATE.INIT]: "rgb(134,144,156)",
};

const TITLE_MSG = (peerId: string) => ({
  [CONNECTION_STATE.READY]: "Disconnected: " + peerId,
  [CONNECTION_STATE.CONNECTED]: "Connected: " + peerId,
  [CONNECTION_STATE.CONNECTING]: "Connecting: " + peerId,
  [CONNECTION_STATE.INIT]: "Unknown State: " + peerId,
});

const closeModal = () => {
  closed.val = true;
  peerId.val = "";
  msgList.val = [];
  connectionState.val = CONNECTION_STATE.READY;
  const { rtcInstance } = GLOBAL.webrtcHolder!;
  rtcInstance?.close();
};

const sendFilesBySlice = async (files: FileList) => {
  const { rtcInstance } = GLOBAL.webrtcHolder!;
  const maxChunkSize = getMaxMessageSize(rtcInstance!);
  for (const file of files) {
    const name = file.name;
    const id = getUniqueId(ID_SIZE);
    const size = file.size;
    const total = Math.ceil(file.size / maxChunkSize);
    sendTextMessage({ type: "file-start", id, name, size, total });
    FILE_SOURCE.set(id, file);
    appendMsg({ type: "file", from: "self", name, size, progress: 0, id });
  }
  // onScroll(listRef);
};

const onSendFile = () => {
  const KEY = "webrtc-file-input";
  const exist = document.querySelector(
    `body > [data-type='${KEY}']`
  ) as HTMLInputElement;
  const input: HTMLInputElement = exist || document.createElement("input");
  input.value = "";
  input.setAttribute("data-type", KEY);
  input.setAttribute("type", "file");
  input.setAttribute("class", styles.fileInput);
  input.setAttribute("accept", "*");
  input.setAttribute("multiple", "true");
  !exist && document.body.append(input);
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    document.body.removeChild(input);
    const files = target.files;
    files && sendFilesBySlice(files);
  };
  input.click();
};

export const CloseIcon = span(
  {
    class: styles.crossIcon,
    onclick: closeModal,
  },
  CrossIcon
);

export const ModalTitle = () => {
  const color = TITLE_DOT_COLOR[connectionState.val];
  const msg = TITLE_MSG(peerId.val)[connectionState.val];
  return div(
    { class: styles.title },
    div({ class: styles.dot, style: `background-color: ${color};` }),
    msg
  );
};

export const ModalFooter = () => {
  const inputDom = input({
    placeholder: "Send Message",
    class: styles.input,
    value: "",
  });

  const handleSendClick = () => {
    const nowStr = inputDom.value;
    inputDom.value = "";
    appendMsg({
      type: "text",
      from: "self",
      data: nowStr,
    });
    sendTextMessage({ type: "text", data: nowStr });
  };

  return div(
    { class: styles.modalFooter },
    Button({ text: "File", icon: FileIcon, onclick: onSendFile }),
    span({ class: styles.footerInputWrapper }, inputDom),
    Button({
      text: "Send",
      icon: SendIcon,
      type: "green",
      onclick: handleSendClick,
    })
  );
};

export const ModalContent = () => {
  const scrollContainer = div({ class: styles.modalContent }, MessageList());
  Promise.resolve().then(() => {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  });
  return scrollContainer;
};
