import { Box, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./drawer-menu.styles"
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import AccessibleIcon from "@material-ui/icons/Accessible";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import { Route } from "../../../generated/client";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  open: boolean;
  routing?: JSX.Element;
  statisticsControls?: JSX.Element;
  savedRoutes?: Route[];
  showSavedRoutes?: boolean;
}

/**
 * Interface describing component state
 */
interface State {
  showAllUserRoutes: boolean;
}

/**
 * Component for Drawer menu
 */
class DrawerMenu extends React.Component<Props, State> {
  /**
   * 
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      showAllUserRoutes: false
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
            <Box mt={ 10 }>
              <Grid container justify="center" direction="row" spacing={ 1 }>
                <Grid xs={ 2 }>
                  <IconButton aria-label="delete">
                    <DirectionsWalkIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={ 2 }>
                  <IconButton>
                    <AccessibleIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={ 2 }>
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
              </List>
              <List>
                { this.renderSavedRoutes() }
              </List>
              <Fab variant="extended" style={{ width: "100%" }} onClick={ this.onShowMoreClick }>
                { this.state.showAllUserRoutes ? "Hide" : "Show more" }
              </Fab>
            </Box>
          </div>
        </Drawer>
      </div>
    );
  }

  /**
   * Returns rendered user saved routes
   */
  private renderSavedRoutes = () => {
    const { savedRoutes, showSavedRoutes } = this.props;
    const { showAllUserRoutes } = this.state;

    if (!savedRoutes || !showSavedRoutes) {
      return;
    }

    const existingRoutes = savedRoutes.map(route => {
      if (route.locationFromName && route.locationToName) {
        return route;
      }
    }).filter( (route: Route | undefined): route is Route => !!route );

    const shortRoutes = existingRoutes.splice(0, 2);
    const routes = showAllUserRoutes ? existingRoutes : shortRoutes;

    return routes.map((route, index) => {
      const savedTime = `Saved on: ${ route.savedAt?.getDay() }.${ route.savedAt?.getMonth() }.${ route.savedAt?.getFullYear() }`;
      const from = `From: ${ route.locationFromName.slice(0, 40) }...`;
      const to = `To: ${ route.locationToName.slice(0, 40) }...`;

      return (
        <div key={ index }>
          <ListItem>
            <div>
              <h4>
                { savedTime }
              </h4>
              <p>
                { from }
              </p>
              <p>
                { to }
              </p>
            </div>
          </ListItem>
          <Divider />
        </div>
      )
    });
  }

  /**
   * Show more saved routes action handler
   */
  private onShowMoreClick = () => {
    const { showAllUserRoutes } = this.state;
    this.setState({
      showAllUserRoutes: !showAllUserRoutes
    });
  }
}

export default withStyles(styles)(DrawerMenu);
