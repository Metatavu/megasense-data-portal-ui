import * as React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

/**
 * Interface representing component properties
 */
interface Props extends SvgIconProps {
  htmlColor?: string;
}

/**
 * Render close x Icon
 */
const LogoIcon = (props: Props) => {
  return (
    <SvgIcon {...props}>
      <g>
        <path d="M11,15.6c0.6-0.2,1.2-0.4,1.7-0.8c0.6-0.4,0.6-0.8-0.1-1.1c-0.4-0.2-0.9-0.4-1.4-0.6c-0.9-0.3-1.7-0.7-2.6-1
          c-0.6-0.2-1.1-0.5-1.5-1C6.6,10.6,6.6,10,7,9.4C7.1,9.2,7.3,9,7.5,8.9C8.2,8.3,9,7.9,9.9,7.7c1.7-0.5,3.3-1,5-1.5
          c1.2-0.4,2.5-0.7,3.6-1.2c2-0.9,3.7-2.1,5.2-3.5c0,0,0.1-0.1,0.1-0.1c-0.7,0-1.3,0-1.9,0c-1,0-2,0-3,0.1c-1.2,0.1-2.3,0.2-3.5,0.3
          c-1.4,0.2-2.8,0.4-4.2,0.7C9.6,2.8,8,3.4,6.4,4.1C5.2,4.7,4.2,5.5,3.3,6.3c-1.1,1.1-2,2.2-2.7,3.6C0,11.4-0.2,13,0.1,14.6
          C0.4,15.9,1,17,1.8,18.1c0.2,0.3,0.4,0.5,0.7,0.8c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.5,0.9-0.8,1.5-1.1c1-0.5,2-0.7,3.1-1
          C8.5,16.2,9.7,15.9,11,15.6z"/>
        <path d="M23.9,1.5C23.9,1.5,23.9,1.5,23.9,1.5c-0.1,0.1-0.2,0.2-0.2,0.3c-0.6,0.8-1.4,1.4-2.1,2c-1.6,1.3-3.5,2.4-5.6,3.1
          c-1.3,0.4-2.6,0.8-3.9,1.2c-0.5,0.2-1.1,0.4-1.6,0.7c-0.3,0.2-0.5,0.4-0.5,0.7c-0.1,0.5,0.2,1,0.6,1.3c0.5,0.4,1.2,0.6,1.8,0.8
          c1,0.3,2.1,0.5,3.1,0.8c0.6,0.2,1.1,0.3,1.6,0.6c0.5,0.3,0.6,0.7,0.3,1.2c-0.3,0.4-0.7,0.9-1.1,1.3c-1.1,1-2.4,1.7-3.8,2.2
          c-1.3,0.5-2.5,1-3.8,1.5c-0.7,0.3-1.4,0.6-2,1c-0.4,0.3-0.8,0.6-0.9,1.1c-0.1,0.1,0,0.2,0.1,0.3c1.8,0.8,3.6,1.2,5.6,1.1
          c1.4-0.1,2.8-0.5,4-1.1c2-1,3.4-2.4,4.6-4.1c1.3-1.8,2.1-3.8,2.6-5.9c0.4-1.3,0.6-2.6,0.8-4c0.1-0.7,0.2-1.5,0.2-2.2
          c0-0.7,0.1-1.4,0.1-2.2C24,2.6,23.9,2.1,23.9,1.5z"/>
      </g>
    </SvgIcon>
  );
}

export default LogoIcon;