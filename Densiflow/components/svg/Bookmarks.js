import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Bookmarks = (props) => (
  <Svg
    width={14}
    height={16}
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.759 12.5467L2.13419 14.9133C1.76494 15.0926 1.31002 14.9657 1.10645 14.6267C1.04756 14.5216 1.01578 14.4052 1.01367 14.2867V3.8C1.01367 1.8 2.47677 1 4.5822 1H9.52818C11.5694 1 13.0967 1.74667 13.0967 3.66667V14.2867C13.0967 14.4759 13.0163 14.6573 12.873 14.7911C12.7298 14.9248 12.5356 15 12.333 15C12.2039 14.9981 12.0769 14.9684 11.9619 14.9133L7.30856 12.5467C7.13708 12.4601 6.93048 12.4601 6.759 12.5467Z"
      fill="#979797"
      stroke="#979797"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Bookmarks;
