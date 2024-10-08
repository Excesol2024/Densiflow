import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Lock = (props) => (
  <Svg
    width={16}
    height={20}
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12.0553 7.66038V5.6923C12.0553 3.38872 10.1871 1.52055 7.8835 1.52055C5.57992 1.51047 3.70442 3.36947 3.69434 5.67397V5.6923V7.66038"
      stroke="#807A7A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.3767 18.4788H4.37248C2.45298 18.4788 0.896484 16.9232 0.896484 15.0028V11.0712C0.896484 9.1508 2.45298 7.59521 4.37248 7.59521H11.3767C13.2962 7.59521 14.8527 9.1508 14.8527 11.0712V15.0028C14.8527 16.9232 13.2962 18.4788 11.3767 18.4788Z"
      stroke="#807A7A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.875 12.019V14.055"
      stroke="#807A7A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Lock;
