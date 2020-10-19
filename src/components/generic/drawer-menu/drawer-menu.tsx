import classes from "*.module.css";
import { Box, Button, Divider, Drawer, Hidden, List, ListItem, MenuItem, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import strings from "../../../localization/strings";
import { styles } from "./drawer-menu.styles"

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
    const { classes, routing } = this.props;
    
    return (
      <div>
        <Drawer
          variant="permanent"
          anchor="left"
          open={ this.props.open }
          ModalProps={{
            keepMounted: true
          }}
        >
          <div className={classes.drawerContainer}>
            <Box mt={10}>
              <List>
                <ListItem>
                  {this.props.routing}
                </ListItem>
                <ListItem>
                  {this.props.statisticsControls}
                </ListItem>
                <Divider />
                <Button variant="text">
                  Collapse menu
                </Button>
              </List>
            </Box>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerMenu);