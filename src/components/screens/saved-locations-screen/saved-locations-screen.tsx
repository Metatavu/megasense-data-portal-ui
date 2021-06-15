import React from "react";

import Api from "../../../api";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { styles } from "./saved-locations.styles";
import { NullableToken } from "../../../types";
import { FavouriteLocation } from "../../../generated/client";
import * as actions from "../../../actions/location";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import AppLayout from "../../layouts/app-layout/app-layout";
import { Container, Card, CardContent, CardActions, withStyles, Button, Typography, WithStyles, CircularProgress, CardHeader } from "@material-ui/core";
import ConfirmDialog from "../../generic/dialogs/confirm-dialog";
import moment from "moment";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {}

interface Props {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  updateDisplayedLocation: (displayedLocation: FavouriteLocation) => void;
}

/**
 * Interface describing component state
 */
interface State {
  deleteDialogVisible: boolean;
  locations: FavouriteLocation[];
  locationToDelete?: FavouriteLocation;
  deletingLocation: boolean;
  loadingLocations: boolean;
  redirect?: string;
  error?: string | Error | Response;
}

/**
 * Component for saved locations screen
 */
class SavedLocationsScreen extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      deleteDialogVisible: false,
      locations: [],
      deletingLocation: false,
      loadingLocations: false
    };
  }

  /**
   * Component life cycle method
   */
  public componentDidMount = async () => {
    await this.updateLocationsList();
  }

  /**
   * Component render method
   */
  public render() {
    const { redirect, deleteDialogVisible, error } = this.state;
    const { accessToken, keycloak, classes } = this.props;

    return (
      <AppLayout 
        accessToken={ accessToken } 
        keycloak={ keycloak } 
        error={ error } 
        clearError={ this.clearError } 
        redirectTo={ redirect }>
        <Container>
          <Typography className={ classes.title } variant="h3" component="h1">
            { strings.savedLocations }
          </Typography>
          {
            this.renderLocationCards()
          }
          <ConfirmDialog 
            title={ strings.deleteConfirm } 
            positiveButtonText={ strings.common.yes } 
            cancelButtonText={ strings.common.cancel } 
            dialogVisible={ deleteDialogVisible } 
            onDialogConfirm={ this.deleteLocation } 
            onDialogCancel={ this.closeDeleteDialog } />
        </Container>
      </AppLayout>
    );
  }

  /**
   * Renders location cards
   * 
   * @returns a rendered location cards
   */
  private renderLocationCards = () => {
    const { classes } = this.props;
    const { locations, loadingLocations } = this.state;
    if (!loadingLocations) {
      return (
        <>
          { locations.map(this.renderLocationCard) }
        </>
      );
    }

    return(
      <CircularProgress className={ classes.primaryLoader } />
    );
  }

  /**
   * Renders a card for a location
   * 
   * @param location a location to render
   * 
   * @returns a rendered card
   */
  private renderLocationCard = (location: FavouriteLocation): JSX.Element => {
    const { classes } = this.props;

    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">
              { location.name }
          </Typography>
          <br />
          <Typography variant="subtitle1" component="p">
            { strings.savedLocationsLatitude }: { location.latitude }
            <br />
            { strings.savedLocationsLongtitude }: { location.longitude }
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" size="small" onClick={ () => this.displayLocation(location) }>{ strings.viewLocation }</Button>
          <Button variant="contained" className={ classes.errorButton } size="small" onClick={ () => this.openDeleteDialog(location) }>{ strings.deleteLocation }</Button>
        </CardActions>
      </Card>
    );
  }

  /**
   * Display location method
   *
   * @param location location to display
   */
  private displayLocation = (location: FavouriteLocation) => {
    this.props.updateDisplayedLocation(location);
    this.setState({ redirect: "/map" });
  } 

  /**
   * Deletes a location
   */
  private deleteLocation = async () => {
    const { accessToken } = this.props;
    const { locationToDelete } = this.state;

    if (!accessToken || !locationToDelete) {
      return;
    }

    this.setState({ deletingLocation: true });

    try {
      const locationsApi = Api.getLocationsApi(accessToken);
      await locationsApi.deleteUserFavouriteLocation({ favouriteId: locationToDelete.id! });
      await this.updateLocationsList();
      this.setState({ deleteDialogVisible: false });
    } catch (error) {
      this.setState({
        error: error
      });
    }

    this.setState({ deletingLocation: false });
  }

  /**
   * Updates the list for locations
   */
  private updateLocationsList = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    this.setState({ loadingLocations: true });

    try {
      const locationsApi = Api.getLocationsApi(accessToken);
      const locations = await locationsApi.listUserFavouriteLocations();
      this.setState({ locations });
    } catch (error) {
      this.setState({
        error: error
      });
    }

    this.setState({ loadingLocations: false });
  }

  /**
   * Closes the delete dialog
   * 
   */
  private closeDeleteDialog = () => {
    this.setState({
      deleteDialogVisible: false,
      locationToDelete: undefined
    });
  }

  /**
   * Opens the delete dialog
   * 
   * @param locationToDelete a location to delete
   */
  private openDeleteDialog = (locationToDelete: FavouriteLocation) => {
    this.setState({
      deleteDialogVisible: true,
      locationToDelete
    });
  }

  /**
   * Clears error
   */
  private clearError = () => {
    this.setState({ 
      error: undefined 
    });
  }
}

/**
 * Redux mapper for mapping store state to component props
 * @param state store state
 */
export function mapStateToProps(state: ReduxState) {
  return {
    accessToken: state.auth.accessToken,
    keycloak: state.auth.keycloak
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    updateDisplayedLocation: (displayedLocation?: FavouriteLocation) => dispatch(actions.setDisplayedFavouriteLocation(displayedLocation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedLocationsScreen));
