import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Minus = (props) => (
  <Svg
    width={18}
    height={2}
    viewBox="0 0 18 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.5 1H1.5"
      stroke="#007AFF"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Minus;
