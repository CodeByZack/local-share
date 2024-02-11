import van from "vanjs-core";
import styles from "./components/index.module.less";
import { DevicesInfo } from "./components/devices-info.ts";
import { Content } from "./components/content.ts";
const { div } = van.tags;

const App = () => {
  return div({ class: styles.container }, Content, DevicesInfo);
};

export default App;
