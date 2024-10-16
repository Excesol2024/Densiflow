import * as React from "react";
import Svg, { Mask, Rect, G, Path } from "react-native-svg";
const Arrow = (props) => (
  <Svg
    width={19}
    height={19}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Mask
      id="mask0_113_13743"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={19}
      height={19}
    >
      <Rect
        x={19}
        y={19}
        width={19}
        height={19}
        transform="rotate(180 19 19)"
        fill="#D9D9D9"
      />
    </Mask>
    <G mask="url(#mask0_113_13743)">
      <Path
        d="M6.33333 1.58341L14.25 9.50008L6.33333 17.4167L4.92813 16.0115L11.4396 9.50008L4.92812 2.98862L6.33333 1.58341Z"
        fill="#007AFF"
      />
    </G>
  </Svg>
);
export default Arrow;
