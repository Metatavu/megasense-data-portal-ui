import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { FavouriteLocation } from "../../generated/client";
import LogoIcon from "../../resources/svg/logo-icon";
import { styles } from "./favourite-locations.styles";
import strings from "../../localization/strings";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import ConfirmDialog from "../generic/dialogs/confirm-dialog";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  savedFavouriteLocations?: FavouriteLocation[];
  showFavouriteLocations?: boolean;
  onDeleteUserFavouriteLocation: (favouriteLocationId: string) => void;
  onUserLocationSelect: (location: FavouriteLocation) => void;
}

/**
 * Interface describing component state
 */
interface State {
  showAllFavouriteLocations: boolean;
  locationDeleteInitiated: boolean;
  locationToDelete?: FavouriteLocation;
}

/**
 * Component for saved routes listing
 */
class FavouritePlaces extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      showAllFavouriteLocations: false,
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
          <Typography variant="h2">{ strings.locations.savedLocations }</Typography>
        </Toolbar>
        <List style={{ paddingTop: 0 }}>
          { this.renderListItems() }
        </List>
        <div className={ classes.showMoreButtonContainer }>
          <Button color="secondary" fullWidth variant="contained" onClick={ this.onShowMoreClick }>
            { this.state.showAllFavouriteLocations ? strings.routes.showLess : strings.routes.showMore }
          </Button>
        </div>
        <ConfirmDialog 
          title={ strings.deleteConfirm } 
          positiveButtonText={ strings.common.yes } 
          cancelButtonText={ strings.common.cancel } 
          dialogVisible={ locationDeleteInitiated } 
          onDialogConfirm={ this.onDeleteConfirm } 
          onDialogCancel={ this.onDeleteCancel } />
      </>
    );
  }

  /**
   * Returns rendered user saved routes
   */
  private renderListItems = () => {
    const { savedFavouriteLocations, showFavouriteLocations } = this.props;
    const { showAllFavouriteLocations } = this.state;

    if (!savedFavouriteLocations || !showFavouriteLocations) {
      return;
    }

    const existingLocations = savedFavouriteLocations.map(location => {
      if (location.latitude && location.longitude) {
        return location;
      }
    }).filter( (location: FavouriteLocation | undefined): location is FavouriteLocation => !!location );

    const locationsToDisplay = showAllFavouriteLocations ? existingLocations : existingLocations.splice(0, 2);

    return locationsToDisplay.map((location, index) => {
      
      const lat = location.latitude;
      const lon = location.longitude;

      return (
        <ListItem button key={ index } onClick={ () => this.onListItemClick(location) }>
          <ListItemAvatar>
            <Avatar>
              <LogoIcon htmlColor="#fff" fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={ location.name }
            secondary={ `${ lat } - ${ lon }` }
          />
          <ListItemSecondaryAction>
            <IconButton 
              size="small" 
              title={ strings.locations.deleteLocation } 
              onClick={ () => this.onDeleteLocationClick(location) }
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    });
  }

  /**
   * List location item click handler click handler
   *
   * @param route route clicked
   */
  private onListItemClick = (location: FavouriteLocation) => {
    const { onUserLocationSelect } = this.props;
    onUserLocationSelect(location);
  }

  /**
   * Initiate location deletion dialog click handler
   *
   * @param location favourite location
   */
  private onDeleteLocationClick = (location: FavouriteLocation) => {
    this.setState({
      locationDeleteInitiated: true,
      locationToDelete: location 
    });
  }

  /**
   * Show more saved locations action handler
   */
  private onShowMoreClick = () => {
    const { showAllFavouriteLocations } = this.state;
    this.setState({
      showAllFavouriteLocations: !showAllFavouriteLocations
    });
  }

  /**
   * Delete confirm action handler
   */
  private onDeleteConfirm = () => {
    const { onDeleteUserFavouriteLocation } = this.props;
    const { locationToDelete } = this.state;
    onDeleteUserFavouriteLocation(locationToDelete?.id!);
    this.setState({
      locationDeleteInitiated: false,
      locationToDelete: undefined
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

export default withStyles(styles)(FavouritePlaces);
