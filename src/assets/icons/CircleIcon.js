import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
function CircleIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        stroke="#000"
        strokeWidth={2}
      />
    </Svg>
  );
}
export default CircleIcon;
