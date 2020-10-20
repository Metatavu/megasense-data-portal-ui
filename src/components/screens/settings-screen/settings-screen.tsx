import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { globalStyles } from "../../../styles/globalStyles"
import { Container, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Button, Typography, WithStyles, Card, CardHeader, Grid, CardContent, CircularProgress } from '@material-ui/core';
import * as Nominatim from "nominatim-browser";
import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab";
import Api from "../../../api";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof globalStyles> {

}

interface Props {
  accessToken?: AccessToken;
}

/**
 * Interface describing component state
 */
interface State {
  visible: boolean;
  homeLocationOptions: string[];
  homeLocation?: string;
  homeLocationTextInput: string;
  userSettingsExist: boolean;
  loadingUserSettings: boolean;
  savingUserSettings: boolean;
}

/**
 * Component for warehouses screen
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
      visible: false,
      homeLocationOptions: [],
      homeLocationTextInput: "",
      userSettingsExist: false,
      savingUserSettings: false,
      loadingUserSettings: false
    };
  }

  public componentDidMount = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    this.setState({ loadingUserSettings: true });
    try {
      const userSettingsApi = Api.getUserSettingsApi(accessToken);
      const userSettings = await userSettingsApi.getUserSettings();
      const homeLocationOptions = [];
      const { homeAddress } = userSettings;

      if (homeAddress) {
        homeLocationOptions.push(homeAddress)
      }

      this.setState({ homeLocation: homeAddress, homeLocationOptions, userSettingsExist: true, homeLocationTextInput: homeAddress || "" });
    } catch (error) {}
    this.setState({ loadingUserSettings: false });
  }

  /**
   * Component render method
   */
  render() {
    const { classes } = this.props;
    const { homeLocationOptions, homeLocationTextInput, homeLocation, loadingUserSettings, savingUserSettings } = this.state;

    return (
      <AppLayout>
        <Container>
          <Grid container spacing = { 3 }>
          <Grid item xs={ 12 }>
            <Card>
              <CardHeader>
              </CardHeader>
              <Typography variant="h3" component="h3">
                { strings.settings }
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <Card>
              <CardHeader>
                Something here
              </CardHeader>
              <CardContent>
                <Box pt={ 3 } pb={ 3 }>
                  <Button variant="contained" >
                    { strings.downloadData }
                  </Button>
                </Box>
                <Box pt={ 3 } pb={ 3 }>
                  <Button variant="contained" >
                    { strings.changeUserData }
                  </Button>
                </Box>
                <Box pt={ 3 } pb={ 3 }>
                  <Button variant="contained" className={classes.errorButton} onClick={() => this.DisplayDeleteDialog()}>
                    { strings.deleteAccount }
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={ 6 }>
            <Card>
              <CardHeader>
                { strings.homeAddress }
              </CardHeader>
              
              { !loadingUserSettings &&
                <CardContent>
                  <Autocomplete
                  onInputChange={ this.onHomeLocationChange } 
                  inputValue={ homeLocationTextInput } 
                  onChange={ this.onHomeLocationSelected } 
                  options={ homeLocationOptions } 
                  getOptionLabel={(option: string) => option || ""} 
                  value={ homeLocation }
                  renderInput={ (params) => 
                    <Box mb={ 10 }>
                      <TextField 
                        placeholder={ strings.homeAddress } 
                        {...params} 
                        variant="outlined" 
                      /> 
                    </Box>

                    } 
                  />

                  { !savingUserSettings &&
                    <Button onClick={ this.saveHomeAddress } variant="contained" className={ classes.successButton }>{ strings.applyChanges }</Button>
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
            open={this.state.visible}
            onClose={() => this.DisplayDeleteDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{strings.deleteAccountDialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { strings.deleteAccountDialogText }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" className={classes.errorButton} onClick={() => this.DisplayDeleteDialog()}>
                { strings.yes }
              </Button>
              <Button variant="contained" className={classes.warningButton} onClick={() => this.DisplayDeleteDialog()} color="primary" autoFocus>
                { strings.cancel }
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AppLayout>
    );
  }

  /**
   * Saves the home address
   */
  private saveHomeAddress = async () => {
    const { accessToken } = this.props;
    const { homeLocation, userSettingsExist } = this.state;

    if (!accessToken) {
      return;
    }

    const userSettingsApi = Api.getUserSettingsApi(accessToken);

    this.setState({ loadingUserSettings: true });
    try {
      if (userSettingsExist) {
        await userSettingsApi.updateUserSettings({ userSettings: { homeAddress: homeLocation } });
      } else {
        await userSettingsApi.createUserSettings({ userSettings: { homeAddress: homeLocation } });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loadingUserSettings: false });
  }

  /**
   * Fires when the value of the text input for home location changes and updates the list of options
   * 
   * @param event React event
   * @param homeLocationTextInput a new value for the text input for home location
   * @param reason autocomplete change reason
   */
  private onHomeLocationChange = async (event: ChangeEvent<{}>, homeLocationTextInput: string, reason: AutocompleteInputChangeReason) => {
    this.setState({ homeLocationTextInput });
    try {
      const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode({ email: "devs@metatavu.fi", q: homeLocationTextInput }, process.env.REACT_APP_NOMINATIM_URL);
      const homeLocationOptions = nominatimResponse.map(option => {
        return option.display_name;
      });

      this.setState({ homeLocationOptions });
    } catch (error) {
      console.log(error);
      this.setState({ homeLocationOptions: [] });
    }
  }

  /**
   * Fires when a new home location is selected
   * 
   * @param event React event
   * @param homeLocation a new value for home location
   * @param reason autocomplete change reason
   */
  private onHomeLocationSelected = (event: React.ChangeEvent<{}>, homeLocation: string | null | undefined, reason: AutocompleteChangeReason) => {
    if (homeLocation === null) {
      homeLocation = undefined;
    }
    this.setState({ homeLocation });
  }

  /**
   * Displays delete dialog
   */
  private DisplayDeleteDialog = () => {
    this.setState({
      visible: this.state.visible ? false : true,
    })
  }
}

/**
 * Redux mapper for mapping store state to component props
 * @param state store state
 */
export function mapStateToProps(state: StoreState) {
  return {
    accessToken: state.accessToken
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(globalStyles)(Settings));