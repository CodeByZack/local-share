import van from "vanjs-core";
import styles from "./index.module.less";

const { path, svg } = van.tagsNS("http://www.w3.org/2000/svg");

export const PhoneIcon = svg(
  {
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
  },
  path({
    d: "M767.516999 1023.032976 256.481977 1023.032976c-30.264281 0-54.753021-23.670096-54.753021-52.862975L201.728956 53.831023c0-29.193903 24.488741-52.865022 54.753021-52.865022l511.035022 0c30.264281 0 54.754045 23.671119 54.754045 52.865022l0 916.337955C822.270021 999.36288 797.78128 1023.032976 767.516999 1023.032976zM511.999488 970.168977c20.141736 0 36.503379-15.774265 36.503379-35.237549 0-19.464307-16.361643-35.254945-36.503379-35.254945-20.142759 0-36.500309 15.792685-36.500309 35.254945C475.498156 954.394712 491.857752 970.168977 511.999488 970.168977zM767.516999 106.695021 749.26531 106.695021 274.733667 106.695021 256.481977 106.695021l0 740.117464 18.251689 0L749.26531 846.812485l18.251689 0L767.516999 106.695021z",
    "p-id": "2399",
  })
);

export const ComputerIcon = svg(
  {
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    "p-id": "11433",
    width: "1em",
    height: "1em",
    fill: "currentColor",
  },
  path({
    d: "M900.010667 128H121.173333C89.685333 128 64 153.685333 64 185.173333v479.829334c0 31.488 25.685333 57.173333 57.173333 57.173333h356.821334v107.946667H330.709333a31.658667 31.658667 0 0 0-31.573333 31.573333c0 17.408 14.165333 31.573333 31.573333 31.573333h358.4c17.408 0 31.573333-14.165333 31.573334-31.573333a31.658667 31.658667 0 0 0-31.573334-31.573333h-147.925333v-107.946667h358.826667c31.488 0 57.173333-25.685333 57.173333-57.173333V185.173333c0-31.530667-25.685333-57.216-57.173333-57.216z m-5.973334 63.189333v467.797334H127.146667V191.189333h766.805333z",
  })
);

export const BoardCastIcon = svg(
  {
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
  },
  path({
    d: "M512 409.6a102.4 102.4 0 0 0-51.2 190.464V1024h102.4v-423.936A102.4 102.4 0 0 0 512 409.6z",
  }),
  path({
    d: "M512 0a512 512 0 0 0-263.168 950.784l51.2-87.552A409.6 409.6 0 1 1 921.6 512a406.528 406.528 0 0 1-199.168 350.72l51.2 87.552A512 512 0 0 0 512 0z",
  }),
  path({
    d: "M819.2 512a307.2 307.2 0 1 0-464.896 262.656l51.2-87.552a204.8 204.8 0 1 1 209.92 0l51.2 87.552A307.2 307.2 0 0 0 819.2 512z",
  })
);

export const CrossIcon = svg(
  {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "4",
    viewBox: "0 0 48 48",
    "aria-hidden": "true",
    focusable: "false",
    class: styles.icon,
  },
  path({
    d: "M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142",
  })
);

export const FileIcon = svg(
  {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "4",
    viewBox: "0 0 48 48",
    "aria-hidden": "true",
    focusable: "false",
    class: styles.icon,
  },
  path({
    d: "M16 21h16m-16 8h10m11 13H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z",
  })
);

export const DownloadIcon = svg(
  {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "4",
    viewBox: "0 0 48 48",
    "aria-hidden": "true",
    focusable: "false",
    class: styles.icon,
  },
  path({
    d: "M5 41h38M24 28V5M24 34.04 17.547 27h12.907L24 34.04Zm-.736.803v.001Z",
  }),
  path({ fill: "currentColor", stroke: "none", d: "m24 34 6-7H18l6 7Z" })
);

export const SendIcon = svg(
  {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "4",
    viewBox: "0 0 48 48",
    "aria-hidden": "true",
    focusable: "false",
    class: styles.icon,
  },
  path({
    "stroke-miterlimit": "3.864",
    d: "m14 24-7-5V7l34 17L7 41V29l7-5Zm0 0h25",
  })
);
