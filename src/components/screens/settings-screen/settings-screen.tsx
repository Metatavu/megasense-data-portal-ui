import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { globalStyles } from "../../../styles/globalStyles"
import { Container, Box, Divider, InputLabel, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Button, Typography, Select, WithStyles } from '@material-ui/core';



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
  visible: boolean
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
      visible: false
    };
  }

  /**
   * Component render method
   */
  render() {
    const { classes } = this.props;

    return (
      <AppLayout>
        <Container>
          <Typography variant="h3" component="h3">
            {strings.settings}
          </Typography>
          <Box mt={ 3 } mb={ 3 }>
            <InputLabel htmlFor="outlined-age-native-simple">{strings.airQualityMode}</InputLabel>
            <Select
              native
              variant="outlined"
            >
              <option>Air quality mode 1</option>
              <option>Air quality mode 2</option>
              <option>Air quality mode 3</option>
            </Select>
          </Box>
          <Box mt={ 3 } mb={ 3 }>
            <InputLabel htmlFor="outlined-age-native-simple">{strings.movementOptions}</InputLabel>
            <Select
              native
              variant="outlined"
            >
              <option>{strings.waliking}</option>
              <option>{strings.wheelerchair}</option>
            </Select>
          </Box>
          <Box mt={ 3 } mb={ 3 }>
            <Typography variant="h4" component="h4">
              { strings.homeAddress }
            </Typography>
            <TextField id="outlined-basic" label={ strings.streetAddress } variant="outlined" />
          </Box>
          <Box mt={ 3 } mb={ 3 }>
            <TextField id="outlined-basic" label={ strings.city } variant="outlined" />
          </Box>
          <Box mt={ 3 } mb={ 3 }>
            <TextField id="outlined-basic" label={ strings.zipCode } variant="outlined" />
          </Box>
          <Box mt={ 3 } mb={ 3 }>
            <TextField id="outlined-basic" label={ strings.country } variant="outlined" />
          </Box>
          <Box mt={ 2 } mb={ 2 }>
            <Button variant="contained" className={ classes.successButton }>{ strings.applyChanges }</Button>
          </Box>
          <Divider variant="fullWidth" orientation="horizontal" />
          <Box pt={ 3 } pb={ 3 }>
            <Button variant="contained" className={ classes.primaryButton }>
              { strings.downloadData }
            </Button>
          </Box>
          <Box pt={ 3 } pb={ 3 }>
            <Button variant="contained" className={ classes.successButton }>
              { strings.changeUserData }
            </Button>
          </Box>
          <Box pt={ 3 } pb={ 3 }>
            <Button variant="contained" className={classes.errorButton} onClick={() => this.DisplayDeleteDialog()}>
              { strings.deleteAccount }
            </Button>
          </Box>
          <Dialog
            open={ this.state.visible }
            onClose={() => this.DisplayDeleteDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{ strings.deleteAccountDialogTitle }</DialogTitle>
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