import * as React from "react";
import Svg, {
  G,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const Rain = (props) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 396 349"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_b_167_3768)">
      <G filter="url(#filter1_i_167_3768)">
        <Path
          d="M318.747 95.0084C319.549 90.4546 319.967 85.7701 319.967 80.9888C319.967 36.2599 283.369 0 238.223 0C204.661 0 175.823 20.0397 163.234 48.7007C153.035 39.9768 139.801 34.7095 125.339 34.7095C93.0918 34.7095 66.9504 60.8972 66.9504 93.2014C66.9504 95.0003 67.0315 96.7801 67.1902 98.5376C51.6799 106.065 41 121.858 41 140.124C41 165.683 61.9131 186.403 87.7108 186.403H308.289C334.087 186.403 355 165.683 355 140.124C355 118.126 339.51 99.7132 318.747 95.0084Z"
          fill="url(#paint0_linear_167_3768)"
        />
      </G>
    </G>
    <G filter="url(#filter2_di_167_3768)">
      <Path
        d="M125.5 136C107.012 160.333 81.1281 209 125.5 209C169.872 209 143.988 160.333 125.5 136Z"
        fill="#00BCFF"
      />
    </G>
    <G filter="url(#filter3_di_167_3768)">
      <Path
        d="M269.5 136C251.012 160.333 225.128 209 269.5 209C313.872 209 287.988 160.333 269.5 136Z"
        fill="#00BCFF"
      />
    </G>
    <G filter="url(#filter4_di_167_3768)">
      <Path
        d="M200.5 237C182.012 261.333 156.128 310 200.5 310C244.872 310 218.988 261.333 200.5 237Z"
        fill="#00BCFF"
      />
    </G>
    <G filter="url(#filter5_f_167_3768)">
      <Rect x={78} y={192} width={240} height={35} rx={17.5} fill="#00BCFF" />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_167_3768"
        x1={60.9717}
        y1={169.76}
        x2={377.746}
        y2={-67.1272}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="white" />
        <Stop offset={1} stopColor="white" stopOpacity={0.58} />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default Rain;
