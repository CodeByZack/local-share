import van from "vanjs-core";
import { CONNECTION_STATE, Member, TransferListItem } from "../../types/client";

export const appState = {
  devices: van.state<Member[]>([]),
  localId: van.state<string>(""),
  peerId: van.state<string>(""),
  closed: van.state(false),
  msgList: van.state<TransferListItem[]>([]),
  connectionState: van.state<CONNECTION_STATE>(CONNECTION_STATE.INIT),
};

export const appendMsg = (msg: TransferListItem) => {
  const newMsgList = [...appState.msgList.val];
  newMsgList.push(msg);
  appState.msgList.val = newMsgList;
};

export const updateFileProgress = (id: string, progress: number) => {
  console.log(id);
  console.log(progress);
  const newMsgList = [...appState.msgList.val];
  const last = newMsgList.find(
    (item) => item.type === "file" && item.id === id
  );
  if (last && last.type === "file") {
    last.progress = progress;
    appState.msgList.val = newMsgList;
  }
};
