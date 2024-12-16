import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const Unhide = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={90} height={90} fill="url(#pattern0_247_946)" />
    <Defs>
      <Pattern
        id="pattern0_247_946"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_247_946" transform="scale(0.0111111)" />
      </Pattern>
      <Image
        id="image0_247_946"
        width={90}
        height={90}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default Unhide;
