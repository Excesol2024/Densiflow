import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Kilometer = (props) => (
  <Svg
    width={12}
    height={16}
    viewBox="0 0 12 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6 0C2.68 0 0 2.68 0 6C0 10 6 16 6 16C6 16 12 10 12 6C12 2.68 9.32 0 6 0ZM6 2C7.06087 2 8.07828 2.42143 8.82843 3.17157C9.57857 3.92172 10 4.93913 10 6C10 8.22 8.22 10 6 10C4.93913 10 3.92172 9.57857 3.17157 8.82843C2.42143 8.07828 2 7.06087 2 6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2Z"
      fill="#007AFF"
    />
  </Svg>
);
export default Kilometer;
