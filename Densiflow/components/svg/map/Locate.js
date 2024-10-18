import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Locate = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17.3492 2.5L2.5 10.2782H9.57107V17.3492L17.3492 2.5Z"
      stroke="#007AFF"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);
export default Locate;
