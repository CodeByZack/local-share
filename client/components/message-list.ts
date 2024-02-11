import van from "vanjs-core";
import styles from "./index.module.less";
import { appState } from "../store";
import { TransferListItem } from "../../types/client";
import { DownloadIcon, FileIcon } from "./icon";
import { Progress } from "./base/progress";
import { FILE_MAPPER, FILE_SOURCE, STEAM_TYPE } from "../utils/binary";
import { formatBytes } from "../utils/format";

const { span, div } = van.tags;
const { msgList } = appState;

const onDownloadFile = (id: string, fileName: string) => {
  const blob = FILE_MAPPER.get(id)
    ? new Blob(FILE_MAPPER.get(id), { type: STEAM_TYPE })
    : FILE_SOURCE.get(id) || new Blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

const FileMsgItem = (msg: TransferListItem) => {
  if (msg.type !== "file") return;

  const className = `${styles.fileDownload} ${
    msg.progress !== 100 && styles.disable
  }`;

  return div(
    { class: styles.fileMessage },
    div(
      { class: styles.fileInfo },
      div(
        div(
          { class: styles.fileName },
          span({ class: styles.fileIcon }, FileIcon),
          msg.name
        ),
        div(formatBytes(msg.size))
      ),
      div(
        { class: className },
        span({ onclick: () => onDownloadFile(msg.id, msg.name) }, DownloadIcon)
      )
    ),
    Progress(msg.progress)
  );
};

const MsgListItem = (msg: TransferListItem) => {
  const { type, from } = msg;

  const msgContent = type === "text" ? span(msg.data) : FileMsgItem(msg);

  const className = `${styles.messageItem} ${
    from === "self" ? styles.alignRight : ""
  }`;

  return div(
    { class: className },
    div({ class: styles.messageContent }, msgContent)
  );
};

export const MessageList = () => {
  return msgList.val.map((msg) => MsgListItem(msg));
};
