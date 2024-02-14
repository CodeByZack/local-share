import van from "vanjs-core";
import styles from "./index.module.less";
import { appState } from "../store";
import { BoardCastIcon } from "./icon";

const { div, a } = van.tags;

export const Content = () =>
  div(
    { class: styles.content },
    div({ class: styles.boardCastIcon }, BoardCastIcon),
    div(() => `Local ID: ${appState.localId.val}  `),
    a(
      {
        class: styles.manualEntry,
        onclick: () => {
          location.hash = "hash-room";
          location.reload();
        },
      },
      "You can custom room name by add hash like `#something`"
    )
  );
