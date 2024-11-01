import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const Eye = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0957 17.9608C11.3881 17.9865 11.6895 18 12.0002 18C16.9093 18 21.0002 12 21.0002 12C21.0002 12 20.3306 11.0179 19.2081 9.84839L11.0957 17.9608Z"
      fill="#979797"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5051 6.49485C13.7076 6.18695 12.8665 6 12 6C5.45455 6 3 12 3 12C3 12 3.75006 13.8335 5.52661 15.4734L9 12C9 10.3431 10.3431 9 12 9L14.5051 6.49485Z"
      fill="#979797"
    />
    <Rect
      opacity={0.3}
      x={5.09961}
      y={18.4351}
      width={19}
      height={2}
      transform="rotate(-45 5.09961 18.4351)"
      fill="#979797"
    />
  </Svg>
);
export default Eye;
