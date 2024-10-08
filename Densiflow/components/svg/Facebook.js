import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const Facebook = (props) => (
  <Svg
    width={31}
    height={31}
    viewBox="0 0 31 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={30.7551} height={30.7551} rx={15.3776} fill="#1977F3" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0962 30.515C17.2136 30.6725 16.305 30.7547 15.3772 30.7547C14.5549 30.7547 13.7476 30.6901 12.9602 30.5658V20.2757H8.78711V15.5405H12.9602V11.9314C12.9602 7.82681 15.4125 5.55884 19.1679 5.55884C20.4003 5.576 21.6298 5.68299 22.8466 5.87893V9.9105H20.7731C18.7317 9.9105 18.0962 11.1731 18.0962 12.4699V15.5412H22.6542L21.9256 20.2757H18.0962V30.515Z"
      fill="white"
    />
  </Svg>
);
export default Facebook;
