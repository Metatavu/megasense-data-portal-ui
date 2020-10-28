import { Box, Button, Divider, Drawer, Grid, IconButton, List, ListItem, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./drawer-menu.styles"
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import AccessibleIcon from '@material-ui/icons/Accessible';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
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
              <Grid container justify="center" direction="row" spacing={ 1 }>
                <Grid xs={ 2 }>
                  <IconButton aria-label="delete">
                    <DirectionsWalkIcon />
                  </IconButton>
                </Grid>
                <Grid xs={ 2 }>
                  <IconButton>
                    <AccessibleIcon />
                  </IconButton>
                </Grid>
                <Grid xs={ 2 }>
                  <IconButton>
                    <DirectionsBikeIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <List>
                <ListItem>
                  { routing }
                </ListItem>
                <ListItem>
                  { statisticsControls }
                </ListItem>
                <Divider />
                <Button variant="text">
                  { strings.collapseMenuText }
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