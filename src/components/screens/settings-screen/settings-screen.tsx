import React, { ChangeEvent } from "react";

import Api from "../../../api";
import { Dispatch } from "redux";
import { History } from "history";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import * as Nominatim from "nominatim-browser";
import strings from "../../../localization/strings";
import { HomeAddress } from "../../../generated/client";
import { ReduxActions, ReduxState } from "../../../store";
import AppLayout from "../../layouts/app-layout/app-layout";
import { globalStyles } from "../../../styles/globalStyles";
import { Container, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Button, Typography, WithStyles, Card, CardHeader, Grid, CardContent, CircularProgress } from '@material-ui/core';

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof globalStyles> {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  history: History<History.LocationState>;
}

/**
 * Interface describing component state
 */
interface State {
  deleteDialogVisible: boolean;
  userSettingsExist: boolean;
  loadingUserSettings: boolean;
  savingUserSettings: boolean;
  homeAddress: HomeAddress;
  locationNotFoundDialogVisible: boolean;
}

/**
 * Component for settings screen
 */
class Settings extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      deleteDialogVisible: false,
      userSettingsExist: false,
      savingUserSettings: false,
      loadingUserSettings: false,
      homeAddress: {
        streetAddress: "",
        postalCode: "",
        city: "",
        country: ""
      },
      locationNotFoundDialogVisible: false
    };
  }

  /**
   * Component life cycle method
   */
  public componentDidMount = async () => {
    const { accessToken, history } = this.props;

    if (!accessToken) {
      history.push("/");
    }

    this.setState({ 
      loadingUserSettings: true 
    });
    try {
      const userSettingsApi = Api.getUsersApi(accessToken);
      const userSettings = await userSettingsApi.getUserSettings();
      const { homeAddress } = userSettings;

      if (homeAddress) {
        this.setState({ 
          homeAddress: homeAddress 
        });
      }
      
      this.setState({ 
        userSettingsExist: true 
      });
    } catch (error) {}
    this.setState({ 
      loadingUserSettings: false 
    });
  }

  /**
   * Component render method
   */
  public render() {
    const { accessToken, keycloak, classes } = this.props;
    const { homeAddress, loadingUserSettings, savingUserSettings, deleteDialogVisible, locationNotFoundDialogVisible } = this.state;
    const { streetAddress, postalCode, city, country } = homeAddress;

    return (
      <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
        <Container>
          <Grid container spacing = { 3 }>
          <Grid item xs={ 12 }>
            <Card>
              <CardHeader>
              </CardHeader>
              <Typography variant="h3" component="h3">
                { strings.settings.title }
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <Card>
              <CardContent>
                <Box pt={ 3 } pb={ 3 }>
                  <Button onClick={ this.downloadData } variant="contained" >
                    { strings.settings.downloadData }
                  </Button>
                </Box>
                <Box pt={ 3 } pb={ 3 }>
                  <Button onClick={ this.onChangeAccountSettings } variant="contained" >
                    { strings.settings.changeUserData }
                  </Button>
                </Box>
                <Box pt={ 3 } pb={ 3 }>
                  <Button variant="contained" className={ classes.errorButton } onClick={() => this.toggleDeleteUserDialog()}>
                    { strings.settings.deleteAccount }
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={ 6 }>
            <Card>
              <CardHeader>
                { strings.settings.homeAddress }
              </CardHeader>
              
              { !loadingUserSettings &&
                <CardContent>
                  
                  <Box mt={ 5 } mb={ 5 }>
                    <TextField
                      placeholder={ strings.settings.streetAddress }
                      value={ streetAddress }
                      onChange={ this.onStreetAddressChange }
                    />
                  </Box>

                  <Box mt={ 5 } mb={ 5 }>
                    <TextField
                      placeholder={ strings.settings.postalCode }
                      value={ postalCode }
                      onChange={ this.onPostalCodeChange }
                    />
                  </Box>

                  <Box mt={ 5 } mb={ 5 }>
                    <TextField
                      placeholder={ strings.settings.city }
                      value={ city }
                      onChange={ this.onCityChange }
                    />
                  </Box>

                  <Box mt={ 5 } mb={ 5 }>
                    <TextField 
                      placeholder={ strings.settings.country }
                      value={ country }
                      onChange={ this.onCountryChange }
                    />
                  </Box>

                  { !savingUserSettings &&
                    <Button 
                      onClick={ this.saveHomeAddress }
                      variant="contained"
                      className={ classes.successButton }
                    >
                      { strings.settings.applyChanges }
                    </Button>
                  }

                  {
                    savingUserSettings && <CircularProgress/>
                  }
                </CardContent>
                }

                {
                  loadingUserSettings && <CircularProgress/>
                }
                
              </Card>
            </Grid>
          </Grid>

          <Dialog
            open={ deleteDialogVisible }
            onClose={ this.toggleDeleteUserDialog }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { strings.settings.deleteAccountDialogTitle }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { strings.settings.deleteAccountDialogText }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                className={ classes.errorButton }
                onClick={ this.deleteUser }
              >
                { strings.common.yes }
              </Button>
              <Button
                variant="contained"
                className={ classes.warningButton }
                onClick={ this.toggleDeleteUserDialog }
                color="primary" autoFocus
              >
                { strings.common.cancel }
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={ locationNotFoundDialogVisible }
            onClose={ this.closeLocationNotFoundDialog }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{ strings.settings.locationNotFoundDialogText }</DialogTitle>
            <DialogActions>
              <Button variant="contained" className={ classes.errorButton } onClick={ this.closeLocationNotFoundDialog }>
                { strings.settings.confirmButtonText }
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AppLayout>
    );
  }

  /**
   * Download user data
   */
  private downloadData = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const usersApi = Api.getUsersApi(accessToken);
    const userData = await usersApi.downloadUserData();
    const blobUrl = URL.createObjectURL(userData)
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "data.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Deletes the user who is logged in and clears all their data
   */
  private deleteUser = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const usersApi = Api.getUsersApi(accessToken);
    await usersApi.deleteUser();
    window.location.href = "/";
  }

  /**
   * Opens a new tab to view account settings in Keycloak
   */
  private onChangeAccountSettings = () => {
    const { keycloak } = this.props;

    if (!keycloak) {
      return;
    }

    window.open(keycloak.createAccountUrl());
  }

  /**
   * Closes the "location not found"-dialog
   */
  private closeLocationNotFoundDialog = () => {
    this.setState({ 
      locationNotFoundDialogVisible: false 
    });
  }

  /**
   * Changes the value of streetAddress in the component state
   * 
   * @param event a change event that contains a new value
   * 
   */
  private onStreetAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { homeAddress } = this.state;
    homeAddress.streetAddress = event.target.value;
    this.setState({ 
      homeAddress: homeAddress 
    });
  }

  /**
   * Changes the value of postalCode in the component state
   * 
   * @param event a change event that contains a new value
   * 
   */
  private onPostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { homeAddress } = this.state;
    homeAddress.postalCode = event.target.value;
    this.setState({ homeAddress });
  }

  /**
   * Changes the value of city in the component state
   * 
   * @param event a change event that contains a new value
   * 
   */
  private onCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { homeAddress } = this.state;
    homeAddress.city = event.target.value;
    this.setState({ homeAddress });
  }

  /**
   * Changes the value of country in the component state
   * 
   * @param event a change event that contains a new value
   * 
   */
  private onCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { homeAddress } = this.state;
    homeAddress.country = event.target.value;
    this.setState({ homeAddress });
  }

  /**
   * Saves the home address
   */
  private saveHomeAddress = async () => {
    const { accessToken } = this.props;
    const { homeAddress, userSettingsExist } = this.state;
    const { streetAddress, postalCode, city, country } = homeAddress;

    if (!accessToken) {
      return;
    }

    this.setState({ 
      savingUserSettings: true 
    });

    const userSettingsApi = Api.getUsersApi(accessToken);
    if (streetAddress === "" && postalCode === "" && city === "" && country === "") {
      try {
        const userSettings = {
          showMobileWelcomeScreen: false,
          pollutantPenalties: {},
          pollutantThresholds: {}
        };
        if (userSettingsExist) {
          await userSettingsApi.updateUserSettings({ 
            userSettings: userSettings
          });
        } else {
          await userSettingsApi.createUserSettings({ 
            userSettings: userSettings
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const geocodeRequest = { email: "devs@metatavu.fi", street: streetAddress, postalcode: postalCode, city, country };
      const nominatimResponse: any[] = await Nominatim.geocode(geocodeRequest, process.env.REACT_APP_NOMINATIM_URL);
      if (nominatimResponse.length !== 1) {
        this.setState({ locationNotFoundDialogVisible: true, savingUserSettings: false });
        return;
      }
  
      try {
        const userSettings = {
          showMobileWelcomeScreen: false,
          pollutantPenalties: {},
          pollutantThresholds: {},
          homeAddress: homeAddress
        };

        if (userSettingsExist) {
          await userSettingsApi.updateUserSettings({
            userSettings: userSettings
          });
        } else {
          await userSettingsApi.createUserSettings({
            userSettings: userSettings
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ savingUserSettings: false });
  }

  /**
   * Toggles the delete user dialog
   */
  private toggleDeleteUserDialog = () => {
    const { deleteDialogVisible } = this.state;
    this.setState({
      deleteDialogVisible: !deleteDialogVisible
    })
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(globalStyles)(Settings));
