import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ProfileSvg = ({ color = "#E0E0E0", ...props }) => (
  <Svg
    width={23}
    height={25}
    viewBox="0 0 23 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13.2438 11.0162C16.0895 10.5544 18.022 7.87321 17.5603 5.02751C17.0985 2.1818 14.4173 0.24924 11.5715 0.71101C8.72584 1.17278 6.79328 3.85402 7.25505 6.69972C7.71682 9.54543 10.3981 11.478 13.2438 11.0162Z"
      fill={color}
    />
    <Path
      d="M0 18.5875C0 21.67 2.50501 24.175 5.58751 24.175H17.2275C20.31 24.175 22.815 21.67 22.815 18.5875C22.815 15.505 20.31 13 17.2275 13H5.58751C2.50501 13 0 15.505 0 18.5875Z"
      fill={color}
    />
  </Svg>
);
export default ProfileSvg;
