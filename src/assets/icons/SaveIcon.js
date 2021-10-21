import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SaveIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M20.782 6.968l-3.75-3.75A.75.75 0 0016.5 3h-12A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-12a.748.748 0 00-.218-.532zM9 4.5h6v3H9v-3zm6 15H9v-6h6v6zm1.5 0v-6A1.5 1.5 0 0015 12H9a1.5 1.5 0 00-1.5 1.5v6h-3v-15h3v3A1.5 1.5 0 009 9h6a1.5 1.5 0 001.5-1.5V4.808l3 3V19.5h-3z"
        fill="#000"
      />
    </Svg>
  );
}

export default SaveIcon;
