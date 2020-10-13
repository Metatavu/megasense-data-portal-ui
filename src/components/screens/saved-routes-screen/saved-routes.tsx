import Alert from "@material-ui/lab/Alert";
import Container from '@material-ui/core/Container';
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent, CardActions } from "@material-ui/core";
import { globalStyles } from "../../../styles/globalStyles"
import { withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof globalStyles>{

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
class SavedRoutes extends React.Component<Props, State> {

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
          <Typography variant="h3" component="h1">
            Saved routes
          </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" component="p">
                  { strings.savedRoutesFrom }: Hallituskatu
                  <br />
                  { strings.savedRoutesTo }: Otavankatu
                </Typography>
                <Typography variant="caption" component="p">
                  { strings.savedRoutesSavedText }: 40.40.2020
                </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" size="small">Preview routew</Button>
              <Button variant="contained" className={ classes.errorButton } size="small" onClick={() => this.DisplayDeleteDialog()}>Delete route</Button>
            </CardActions>
          </Card>
          <Dialog
            open={ this.state.visible }
            onClose={ () => this.DisplayDeleteDialog() }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{ strings.DeleteTitle }</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { strings.savedRoutesFrom }: Hallituskatu
          </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                { strings.savedRoutesTo }: Otavankatu
          </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                { strings.savedRoutesSavedText }:  40.40.2020
          </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" className={ classes.errorButton } onClick={() => this.DisplayDeleteDialog()}>
                { strings.yes }
              </Button>
              <Button variant="contained" className={ classes.warningButton } onClick={() => this.DisplayDeleteDialog()} color="primary" autoFocus>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(globalStyles)(SavedRoutes));
