import van, { ChildDom, State } from "vanjs-core";

const { div } = van.tags;

const toStyleStr = (style: any) =>
  Object.entries(style)
    .map(([k, v]) => `${k}: ${v};`)
    .join("");

export interface ModalProps {
  closed: State<boolean>;
  backgroundColor?: string;
  blurBackground?: boolean;
  backgroundClass?: string;
  backgroundStyleOverrides?: { [x: string]: any };
  modalClass?: string;
  modalStyleOverrides?: { [x: string]: any };
}

export const Modal = (option: ModalProps, ...children: ChildDom[]) => {
  const {
    closed,
    backgroundColor = "rgba(0,0,0,.5)",
    blurBackground = false,
    backgroundClass = "",
    backgroundStyleOverrides = {},
    modalClass = "",
    modalStyleOverrides = {},
  } = option;

  const backgroundStyle = {
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "fixed",
    "z-index": 10000,
    "background-color": backgroundColor,
    "backdrop-filter": blurBackground ? "blur(0.25rem)" : "none",
    ...backgroundStyleOverrides,
  };
  const modalStyle = {
    "border-radius": "0.5rem",
    display: "block",
    "background-color": "white",
    ...modalStyleOverrides,
  };
  return () =>
    closed.val
      ? null
      : div(
          { class: backgroundClass, style: toStyleStr(backgroundStyle) },
          div({ class: modalClass, style: toStyleStr(modalStyle) }, children)
        );
};
