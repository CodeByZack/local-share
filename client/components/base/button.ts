import van from "vanjs-core";
import styles from "./base.module.less";

interface ButtonProps {
  text: string;
  onclick?: any;
  icon?: Element;
  type?: "blue" | "green";
}

const typeClassMap = {
  blue: styles.blue,
  green: styles.green,
};

const { span, button } = van.tags;

const Button = (option: ButtonProps) => {
  const { text, icon, type = "blue", onclick } = option;

  const btnClass = `${styles.btnBase} ${typeClassMap[type]}`;

  const iconDom = icon ? span({ class: styles.btnIcon }, icon) : null;

  return button(
    {
      class: btnClass,
      type: "button",
      onclick,
    },
    iconDom,
    span({ class: styles.btnText }, text)
  );
};

export default Button;
