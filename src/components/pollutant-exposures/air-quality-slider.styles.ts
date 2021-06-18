import { createStyles, Slider } from '@material-ui/core';
import { globalStyles } from '../../styles/globalStyles';

import theme from "../../theme/theme";

export const styles = createStyles({
  ...globalStyles,

  slider: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%"
  }
});
