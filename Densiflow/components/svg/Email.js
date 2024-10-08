import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Email = (props) => (
  <Svg
    width={20}
    height={18}
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.8287 6.30591L10.9187 9.45399C10.1788 10.0341 9.14151 10.0341 8.40156 9.45399L4.45801 6.30591"
      stroke="#807A7A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.31356 1.20825H13.9558C15.2019 1.22223 16.3879 1.74902 17.2377 2.66594C18.0874 3.58286 18.5267 4.80986 18.4531 6.06119V12.0451C18.5267 13.2964 18.0874 14.5234 17.2377 15.4403C16.3879 16.3573 15.2019 16.884 13.9558 16.898H5.31356C2.63697 16.898 0.833008 14.7205 0.833008 12.0451V6.06119C0.833008 3.38575 2.63697 1.20825 5.31356 1.20825Z"
      stroke="#807A7A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Email;
