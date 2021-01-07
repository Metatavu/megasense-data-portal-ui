import { Avatar, Button, Dialog, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Route } from "../../../generated/client";
import LogoIcon from "../../../resources/svg/logo-icon";
import { styles } from "./saved-routes.styles";
import strings from "../../../localization/strings";

import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import theme from "../../../theme/theme";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  savedRoutes?: Route[],
  showSavedRoutes?: boolean,
  deleteUserSavedRoute: (routeId: string) => void;
}

/**
 * Interface describing component state
 */
interface State {
  showAllUserRoutes: boolean,
  routeDeleteInitiated: boolean,
  deletedRouteId: string
}

/**
 * Component for saved routes listing
 */
class SavedRoutes extends React.Component<Props, State> {
  /**
   * Component constructor
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      showAllUserRoutes: false,
      routeDeleteInitiated: false,
      deletedRouteId: ""
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes } = this.props;
    return (
      <>
        <Toolbar>
          <Typography variant="h2">{ strings.routes.savedRoutes }</Typography>
        </Toolbar>
        <List style={{ paddingTop: 0 }}>
          { this.renderListItems() }
        </List>
        <div className={ classes.showMoreButtonContainer }>
          <Button color="secondary" fullWidth variant="contained" onClick={ this.onShowMoreClick }>
            { this.state.showAllUserRoutes ? strings.routes.showLess : strings.routes.showMore }
          </Button>
        </div>
        { this.renderDeleteDialog() }
      </>
    );
  }

  /**
   * Returns rendered user saved routes
   */
  private renderListItems = () => {
    const { savedRoutes, showSavedRoutes } = this.props;
    const { showAllUserRoutes } = this.state;

    if (!savedRoutes || !showSavedRoutes) {
      return;
    }

    const userRoutes = savedRoutes.map(route => {
      if (route.locationFromName && route.locationToName) {
        return route;
      }
    }) as Route[];

    const shortRoutes = userRoutes.splice(0, 2);
    const routes = showAllUserRoutes ? userRoutes : shortRoutes;

    return routes.map((route, index) => {
      
      if (!route) {
        return null;
      }
      
      const  savedTime = `Saved on: ${ route.savedAt?.getDay() }.${ route.savedAt?.getMonth() }.${ route.savedAt?.getFullYear() }`;
      const from = route.locationFromName.slice(0, 40);
      const to = route.locationToName.slice(0, 40);

      return (
        <ListItem button key={ index }>
          <ListItemAvatar>
            <Avatar>
              <LogoIcon htmlColor="#fff" fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary="Route name"
            secondary={ `${ from } - ${ to }` }
          />
          <ListItemSecondaryAction>
            <IconButton size="small" title={ strings.routes.deleteRoute } onClick={ () => this.onDeleteRouteClick(route.id ? route.id : "") }>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    });
  }

  /**
   * Renders delete confirmation dialog
   */
  private renderDeleteDialog = () => {
    const { routeDeleteInitiated } = this.state;
    if (routeDeleteInitiated) {
      return (
        <Dialog open={ routeDeleteInitiated }>
          <h1>Delete route</h1>
          <div>
            <Button
              variant="outlined"
              style={{ margin: "20px", width: "60px" }}
              onClick={ () => { this.onDeleteConfirm() } }
            >
              delete
            </Button>
            <Button
              variant="outlined"
              style={{ margin: "20px", width: "-webkit-fill-available" }}
              onClick={ () => { this.onDeleteCancel() } }
            >
              cancel
            </Button>
          </div>
        </Dialog>
      )
    }
  }

  /**
   * Initiates route deletion dialog
   *
   * @param routeId route Id string
   */
  private onDeleteRouteClick = (routeId: string) => {
    this.setState({
      routeDeleteInitiated: true,
      deletedRouteId: routeId
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

  /**
   * Hides route deletion dialog
   */
  private onDeleteConfirm = () => {
    const { deleteUserSavedRoute } = this.props;
    const { deletedRouteId } = this.state;
    deleteUserSavedRoute(deletedRouteId);
    this.setState({
      routeDeleteInitiated: false
    })
  }

  /**
   * Hides route deletion dialog
   */
  private onDeleteCancel = () => {
    this.setState({
      routeDeleteInitiated: false,
      deletedRouteId: ""
    })
  }
}

export default withStyles(styles)(SavedRoutes);
