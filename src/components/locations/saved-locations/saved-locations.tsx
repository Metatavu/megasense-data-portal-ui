import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Route } from "../../../generated/client";
import LogoIcon from "../../../resources/svg/logo-icon";
import { styles } from "./saved-locations.styles";
import strings from "../../../localization/strings";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import ConfirmDialog from "../../generic/dialogs/confirm-dialog";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  savedRoutes?: Route[];
  showSavedRoutes?: boolean;
  onDeleteUserSavedRoute: (routeId: string) => void;
  onUserRouteSelect: (route: Route) => void;
}

/**
 * Interface describing component state
 */
interface State {
  showAllUserLocations: boolean;
  locationDeleteInitiated: boolean,
  locationToDelete?: Route
}

/**
 * Component for saved locations listing
 */
class SavedLocations extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      showAllUserLocations: false,
      locationDeleteInitiated: false
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes } = this.props;
    const { locationDeleteInitiated } = this.state;
    return (
      <>
        <Toolbar>
          <Typography variant="h2">{ strings.routes.savedRoutes }</Typography>
        </Toolbar>
        <List style={{ paddingTop: 0 }}>
          { this.renderListItems() }
        </List>
        <div className={ classes.showMoreButtonContainer }>
          <Button 
            className={ classes.primaryButton }
            fullWidth
            variant="contained"
            onClick={ this.onShowMoreClick }
          >
            { this.state.showAllUserLocations ? strings.showLess : strings.showMore }
          </Button>
        </div>
        <ConfirmDialog 
          title={ strings.deleteConfirm } 
          positiveButtonText={ strings.common.yes } 
          cancelButtonText={ strings.common.cancel } 
          dialogVisible={ routeDeleteInitiated } 
          onDialogConfirm={ this.onDeleteConfirm } 
          onDialogCancel={ this.onDeleteCancel } />
      </>
    );
  }

  /**
   * Returns rendered user saved routes
   */
  private renderListItems = () => {
    const { savedRoutes, showSavedRoutes } = this.props;
    const { showAllUserLocations } = this.state;

    if (!savedRoutes || !showSavedRoutes) {
      return;
    }

    const existingRoutes = savedRoutes.map(route => {
      if (route.locationFromName && route.locationToName) {
        return route;
      }
    }).filter( (route: Route | undefined): route is Route => !!route );

    const routesToDisplay = showAllUserLocations ? existingRoutes : existingRoutes.splice(0, 2);

    return routesToDisplay.map((route, index) => {
      const routeName = route.name;
      const from = this.truncateName(route.locationFromName, 40);
      const to = this.truncateName(route.locationToName, 40);

      return (
        <ListItem button key={ index } onClick={ () => this.onListItemClick(route) }>
          <ListItemAvatar>
            <Avatar>
              <LogoIcon htmlColor="#fff" fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={ routeName }
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
   * List route item click handler click handler
   *
   * @param route route clicked
   */
  private onListItemClick = (route: Route) => {
    const { onUserRouteSelect } = this.props;
    onUserRouteSelect(route);
  }

  /**
   * Initiate route deletion dialog click handler
   *
   * @param routeId route Id string
   */
  private onDeleteRouteClick = (route: Route) => {
    this.setState({
      locationDeleteInitiated: true,
      locationToDelete: route 
    });
  }

  /**
   * Show more saved routes action handler
   */
  private onShowMoreClick = () => {
    const { showAllUserLocations } = this.state;
    this.setState({
      showAllUserLocations: !showAllUserLocations
    });
  }

  /**
   * Delete confirm action handler
   */
  private onDeleteConfirm = () => {
    const { onDeleteUserSavedRoute } = this.props;
    const { locationToDelete } = this.state;
    onDeleteUserSavedRoute(routeToDelete?.id!);
    this.setState({
      locationDeleteInitiated: false,
      routeToDelete: undefined
    })
  }

  /**
   * Delete cancel action handler
   */
  private onDeleteCancel = () => {
    this.setState({
      locationDeleteInitiated: false,
      locationToDelete: undefined
    })
  }
}

export default withStyles(styles)(SavedLocations);
