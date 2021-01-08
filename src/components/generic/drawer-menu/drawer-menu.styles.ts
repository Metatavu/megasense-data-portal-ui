import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

const drawerWidth = 250;
export const styles = createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'overflow',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
})
