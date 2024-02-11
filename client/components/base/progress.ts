import van from "vanjs-core";
import styles from "./base.module.less";

const { div } = van.tags;
export const Progress = (progress: number) => {
  const progressInnerStyle = `width: ${progress}%; background-color: rgb(255, 255, 255);`;

  const processLineInner = div({
    class: styles.progressLineInner,
    style: progressInnerStyle,
  });

  const processLineOuter = div(
    { class: styles.progressLineOuter },
    processLineInner
  );

  const processLineText = div(
    { class: styles.progressLineText },
    `${progress}%`
  );

  const progressLineWrapper = div(
    { class: styles.progressLineWrapper },
    processLineOuter,
    processLineText
  );

  return div({ class: styles.progressLine }, div(progressLineWrapper));
};
