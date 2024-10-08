import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Fourth = (props) => (
  <Svg
    width={26}
    height={20}
    viewBox="0 0 26 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M25.5 2.5V17.5C25.5 18.1875 25.255 18.7763 24.765 19.2663C24.275 19.7563 23.6867 20.0008 23 20H3C2.3125 20 1.72375 19.755 1.23375 19.265C0.743752 18.775 0.499169 18.1867 0.500002 17.5V2.5C0.500002 1.8125 0.745002 1.22375 1.235 0.733752C1.725 0.243752 2.31334 -0.000831211 3 2.12224e-06H23C23.6875 2.12224e-06 24.2763 0.245002 24.7663 0.735002C25.2563 1.225 25.5008 1.81334 25.5 2.5ZM3 5H23V2.5H3V5ZM3 10V17.5H23V10H3Z"
      fill="#007AFF"
    />
  </Svg>
);
export default Fourth;
