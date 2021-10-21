import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
function TrushIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.25 8.25A.75.75 0 019 9v9a.75.75 0 11-1.5 0V9a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75v9a.75.75 0 11-1.5 0V9a.75.75 0 01.75-.75zm4.5.75A.75.75 0 1015 9v9a.75.75 0 101.5 0V9z"
        fill="#000"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.75 4.5a1.5 1.5 0 01-1.5 1.5h-.75v13.5a3 3 0 01-3 3h-9a3 3 0 01-3-3V6h-.75a1.5 1.5 0 01-1.5-1.5V3a1.5 1.5 0 011.5-1.5H9A1.5 1.5 0 0110.5 0h3A1.5 1.5 0 0115 1.5h5.25a1.5 1.5 0 011.5 1.5v1.5zM6.177 6L6 6.088V19.5A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5V6.088L17.823 6H6.177zM3.75 4.5V3h16.5v1.5H3.75z"
        fill="#000"
      />
    </Svg>
  );
}
export default TrushIcon;
