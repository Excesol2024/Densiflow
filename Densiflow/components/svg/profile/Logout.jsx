import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Logout = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.25 7L16.5 8.75L18.5 10.75H8.25V13.25H18.5L16.5 15.25L18.25 17L23.25 12L18.25 7ZM3.25 3.25H12V0.75H3.25C1.875 0.75 0.75 1.875 0.75 3.25V20.75C0.75 22.125 1.875 23.25 3.25 23.25H12V20.75H3.25V3.25Z"
      fill="#007AFF"
    />
  </Svg>
);
export default Logout;
