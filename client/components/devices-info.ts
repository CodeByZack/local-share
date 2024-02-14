import { appState } from "../store";
import van, { State } from "vanjs-core";
import styles from "./index.module.less";
import { DEVICE_TYPE, Member } from "../../types/client";
import { GLOBAL } from "../main";
import { ComputerIcon, PhoneIcon } from "./icon";
import { showModal } from "../transfer-modal";

const { div } = van.tags;
const { devices } = appState;

const connectPeer = (member: Member, e?: MouseEvent) => {
  e?.stopPropagation();
  GLOBAL.rtcInstance!.connect(member.id);
  showModal();
  appState.peerId.val = member.id;
};

const Prompt = div(
  { class: styles.prompt },
  "Open Another Device On The LAN To Transfer Files"
);

const Device = (member: Member) => {
  return div(
    {
      class: styles.device,
      onclick: (e) => connectPeer(member, e),
    },
    div(
      { class: styles.icon },
      member.device === DEVICE_TYPE.MOBILE ? PhoneIcon() : ComputerIcon()
    ),
    div({ class: styles.name }, member.id)
  );
};

const DeviceGroup = (devices: State<Member[]>) => {
  return div(
    { class: styles.deviceGroup },
    devices.val.map((v) => Device(v))
  );
};

export const DevicesInfo = () =>
  devices.val.length ? DeviceGroup(devices) : Prompt;
