import { Box, Button, Divider, Drawer, List, ListItem, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
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
    const { classes, routing, statisticsControls, open } = this.props;
    
    return (
      <div>
        <Drawer
          variant="permanent"
          anchor="left"
          open={ open }
          ModalProps={{
            keepMounted: true
          }}
        >
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