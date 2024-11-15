import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const Close = (props) => (
  <Svg
    width={19}
    height={19}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={19} height={19} fill="url(#pattern0_167_2702)" />
    <Defs>
      <Pattern
        id="pattern0_167_2702"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_167_2702" transform="scale(0.0111111)" />
      </Pattern>
      <Image
        id="image0_167_2702"
        width={90}
        height={90}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC5UlEQVR4nO2cy24TMRSGLe6wgAUsAQnBA8DD9BW6Cyj2sSdCAi+AnKMCC5a8Au/BArWigAQVCAT0JbioLchpQitEhzQz8ZzJ/J80yzRnvv459iS2jQEAAAAAAAAAAAAAAAAAAJiGGOOxpaVnR7XbijGeiDEeMW2i14tnrefb5GWDAv90XrbJyxvn2ff7j08bJaRaKEigIG9Tjc7LD/LyngoZFIWcM5ohWrnqAn+kIL/+dbnAr629d6npOlMN6Z9fUueH/mB4zWgkxnjGefl8UPE0ubx8Kgq53FSd6b1TDdPUqekT+AcKcue/xYdmZU8teZJsz3eNNsjLq6lFh3TxF+ceXsnZLsra2gEtZN1om12MBr1DiZZsyT5skvcSLdvqZiMU+PuhRYf5J3uWJO8T/c1og7y8nE20zC3ZsyZ5X11rRhvW862ZbyjUL7uy5FGPlptGG8vLT4+T5+eVZId62kiVdrHXNvhFemI0GglBLlZNEVVMdh1JTq9P92I0U0eaaMZkN/nejdDEDduuSW7ixm1XJecUYLsuOYcIC8nzF2Ihef7JtpCcZ45LDc/VW4GtJY0dH/j0y+buSG5Odgcl55fdYcn5ZENyBtmQnEE2JGeQDcmlQHQGLFpHGyULWsjfYHqXAYsHlkWSLN1tIxZfKi2yZOlOsgt88T9/LH7KapdkM8e/2Wqw3CADWECTASwJywAWOWYAy3YzgIXoGYgxnnKBVxdma0Xg9bQb2GhjvIG9cck172NxRhu7pxks1vY35/md0USv9+QkBd7SkOR6k81bqnZm7Z59wTvaJFeXzTtp7DGaoCCbGtpFnW3EeflqtOG8sLYkV02283zfaMPaRxemSrVvycEoQTYHg+F5oxFb8I0y2S7wqoYdqeMHq7WylkG0ct1oZpRsz8NRseORm0YHRHFf08AyesDy7NIUbjJjSjW7IA/UJrnsZlRNj8qPY1MTAgAAAAAAAAAAAAAAAAAAGN38Bi9kbzEABdbNAAAAAElFTkSuQmCC"
      />
    </Defs>
  </Svg>
);
export default Close;
