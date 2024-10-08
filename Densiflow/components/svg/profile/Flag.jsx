import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Flag = (props) => (
  <Svg
    width={19}
    height={22}
    viewBox="0 0 19 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.5 2.5L10.25 0H0.25V21.25H2.75V12.5H9L10.25 15H19V2.5H11.5ZM16.5 12.5H11.5L10.25 10H2.75V2.5H9L10.25 5H16.5V12.5Z"
      fill="#007AFF"
    />
  </Svg>
);
export default Flag;
