import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const MiniSvg = (props) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_23_1530)">
      <Path
        d="M12.25 5.83325C12.25 9.91658 7 13.4166 7 13.4166C7 13.4166 1.75 9.91658 1.75 5.83325C1.75 4.44087 2.30312 3.10551 3.28769 2.12094C4.27226 1.13638 5.60761 0.583252 7 0.583252C8.39239 0.583252 9.72774 1.13638 10.7123 2.12094C11.6969 3.10551 12.25 4.44087 12.25 5.83325Z"
        fill="#B0B1BC"
        stroke="#B0B1BC"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 7.58325C7.9665 7.58325 8.75 6.79975 8.75 5.83325C8.75 4.86675 7.9665 4.08325 7 4.08325C6.0335 4.08325 5.25 4.86675 5.25 5.83325C5.25 6.79975 6.0335 7.58325 7 7.58325Z"
        fill="white"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_23_1530">
        <Rect width={14} height={14} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default MiniSvg;
