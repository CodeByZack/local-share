import van from "vanjs-core";
import styles from "./index.module.less";
import { appState } from "../store";
import { BoardCastIcon } from "./icon";

const { div } = van.tags;

export const Content = () =>
  div(
    { class: styles.content },
    div({ class: styles.boardCastIcon }, BoardCastIcon),
    div(() => `Local ID: ${appState.localId.val}`),
    div(
      { class: styles.manualEntry },
      "Request To Establish P2P Connection By ID"
    )
  );
