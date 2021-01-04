import { Box, Button, Divider, Drawer, Grid, IconButton, List, ListItem, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./drawer-menu.styles"
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import AccessibleIcon from "@material-ui/icons/Accessible";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import strings from "../../../localization/strings"
/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  open: boolean,
  routing?: JSX.Element,
  statisticsControls?: JSX.Element
}

/**
 * Interface describing component state
 */
interface State {}

class DrawerMenu extends React.Component<Props, State> {
  /**
   * 
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
    };
  }

  public render = () => {
    const { classes, routing, statisticsControls, open } = this.props;
    
    return (
      <Drawer
        variant="permanent"
        anchor="left"
        open={ open }
        ModalProps={{
          keepMounted: true
        }}
      >
        <Toolbar />
        <div className={ classes.drawerContainer }>
          <Box mt={10}>
            <List>
              <ListItem>
                { routing }
              </ListItem>
              <ListItem>
                { statisticsControls }
              </ListItem>
              <Divider />
            </List>
          </Box>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(DrawerMenu);