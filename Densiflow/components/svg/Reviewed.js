import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Reviewed = (props) => (
  <Svg
    width={18}
    height={17}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14 0.5H2C1.175 0.5 0.5 1.175 0.5 2V15.5L3.5 12.5H14C14.825 12.5 15.5 11.825 15.5 11V2C15.5 1.175 14.825 0.5 14 0.5ZM3.5 9.5V7.6475L8.66 2.4875C8.81 2.3375 9.0425 2.3375 9.1925 2.4875L10.52 3.815C10.67 3.965 10.67 4.1975 10.52 4.3475L5.3525 9.5H3.5ZM11.75 9.5H6.875L8.375 8H11.75C12.1625 8 12.5 8.3375 12.5 8.75C12.5 9.1625 12.1625 9.5 11.75 9.5Z"
      fill="#FFCC00"
    />
  </Svg>
);
export default Reviewed;
