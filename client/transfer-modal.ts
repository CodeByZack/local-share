import { Modal } from "./components/modal";
import styles from "./components/index.module.less";
import { appState } from "./store";
import van from "vanjs-core";
import {
  CloseIcon,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "./components/modal-components";

const { div } = van.tags;
const { closed } = appState;

export const showModal = () => {
  const modal = Modal(
    { closed, modalClass: styles.modalWrapper },
    div(
      { class: styles.modal },
      ModalTitle,
      ModalContent,
      ModalFooter(),
      CloseIcon
    )
  );
  appState.closed.val = false;
  van.add(document.body, modal);
};
