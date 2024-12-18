import * as React from "react";
import Svg, { Path } from "react-native-svg";
const StickArrow = (props) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1.84232 8.5H13.459"
      stroke="#007AFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.50065 13.4582L13.459 8.49984L8.50065 3.5415"
      stroke="#007AFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default StickArrow;
