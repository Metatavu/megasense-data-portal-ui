import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Route } from "../../../generated/client";
import LogoIcon from "../../../resources/svg/logo-icon";
import { styles } from "./saved-routes.styles";
import strings from "../../../localization/strings";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import DeleteDialogue from "../../generic/confirm-dialog";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  savedRoutes?: Route[];
  showSavedRoutes?: boolean;
  onDeleteUserSavedRoute: (routeId: string) => void;
}

/**
 * Interface describing component state
 */
interface State {
  showAllUserRoutes: boolean;
  routeDeleteInitiated: boolean,
  routeToDelete?: Route
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
      routeDeleteInitiated: false
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes } = this.props;
    const { routeDeleteInitiated } = this.state;
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
        <DeleteDialogue title={ strings.deleteConfirm } positiveButtonText={ strings.yes } cancelButtonText={ strings.cancel } dialogVisible={ routeDeleteInitiated } onDialogConfirm={ this.onDeleteConfirm } onDialogCancel={ this.onDeleteCancel } />
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

    const existingRoutes = savedRoutes.map(route => {
      if (route.locationFromName && route.locationToName) {
        return route;
      }
    }).filter( (route: Route | undefined): route is Route => !!route );

    const shortRoutes = existingRoutes.splice(0, 2);
    const routes = showAllUserRoutes ? existingRoutes : shortRoutes;

    return routes.map((route, index) => {
      
      const from = this.truncateName(route.locationFromName, 40);
      const to = this.truncateName(route.locationToName, 40);

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
            <IconButton 
              size="small" 
              title={ strings.routes.deleteRoute } 
              onClick={ () => this.onDeleteRouteClick(route) }
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    });
  }

  /**
   * Formats and truncates a name string
   * 
   * @param name name string
   * @param delimiter delimiter number
   */
  private truncateName = (name: string, delimiter: number ) => {
    if (name.length <= delimiter) {
      return name;
    }
    return `${ name.slice(0, delimiter) }...`;
  }

  /**
   * Initiate route deletion dialog click handler
   *
   * @param routeId route Id string
   */
  private onDeleteRouteClick = (route: Route) => {
    this.setState({
      routeDeleteInitiated: true,
      routeToDelete: route 
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
   * Delete confirm action handler
   */
  private onDeleteConfirm = () => {
    const { onDeleteUserSavedRoute } = this.props;
    const { routeToDelete } = this.state;
    onDeleteUserSavedRoute(routeToDelete?.id!);
    this.setState({
      routeDeleteInitiated: false,
      routeToDelete: undefined
    })
  }

  /**
   * Delete cancel action handler
   */
  private onDeleteCancel = () => {
    this.setState({
      routeDeleteInitiated: false,
      routeToDelete: undefined
    })
  }
}

export default withStyles(styles)(SavedRoutes);
