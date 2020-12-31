import React from "react";

import Api from "../../../api";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { styles } from "./saved-routes.styles";
import { NullableToken } from "../../../types";
import { Route } from "../../../generated/client";
import * as actions from "../../../actions/route";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import AppLayout from "../../layouts/app-layout/app-layout";
import { Container, Card, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Button, Typography, WithStyles, CircularProgress } from '@material-ui/core';

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {}

interface Props {
  accessToken?: NullableToken;
  updateDisplayedRoute: (displayedRoute: Route) => void;
}

/**
 * Interface describing component state
 */
interface State {
  deleteDialogVisible: boolean;
  routes: Route[];
  routeToDelete?: Route;
  deletingRoute: boolean;
  loadingRoutes: boolean;
  redirect: boolean;
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
      deleteDialogVisible: false,
      routes: [],
      deletingRoute: false,
      loadingRoutes: false,
      redirect: false
    };
  }

  public componentDidMount = async () => {
    await this.updateRoutesList();
  }

  /**
   * Component render method
   */
  render() {
    const { routes, redirect } = this.state;
    const { classes } = this.props;
    const routeCards = routes.map(this.renderRouteCard);
 
    if (redirect) {
      return (
        <Redirect to="/map" push={ true }/>
      );
    }

    return (
      <AppLayout>
        <Container>
          <Typography className={ classes.title } variant="h3" component="h1">
            { strings.savedRoutes }
          </Typography>
          {
            this.state.loadingRoutes &&
            <CircularProgress className={ classes.primaryLoader } />
          }

          {
            !this.state.loadingRoutes && routeCards 
          }

          { 
            this.renderDeleteDialog() 
          }
        </Container>
      </AppLayout>
    );
  }

  /**
   * Updates the list for routes
   */
  private updateRoutesList = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    this.setState({ loadingRoutes: true });

    try {
      const routesApi = Api.getRoutesApi(accessToken);
      const routes = await routesApi.listRoutes();
      this.setState({ routes });
    } catch (error) {
      console.log(error);
    }

    this.setState({ loadingRoutes: false });
  }

  /**
   * Renders a card for a route
   * 
   * @param route a route to render
   * 
   * @returns a rendered card
   */
  private renderRouteCard = (route: Route): JSX.Element => {
    const { classes } = this.props;

    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" component="p">
            { strings.savedRoutesFrom }: { route.locationFromName }
              <br />
            { strings.savedRoutesTo }: { route.locationToName }
            </Typography>
          <Typography variant="caption" component="p">
            { strings.savedRoutesSavedText }: { this.dateToYMD(route.savedAt!) }
            </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" size="small" onClick={ () => this.displayRoute(route) }>{ strings.viewRoute }</Button>
          <Button variant="contained" className={ classes.errorButton } size="small" onClick={ () => this.openDeleteDialog(route) }>{ strings.deleteRoute }</Button>
        </CardActions>
      </Card>
    );
  }

  private displayRoute = (route: Route) => {
    this.props.updateDisplayedRoute(route);
    this.setState({ redirect: true });
  } 

  /**
   * Renders the dialog to delete routes
   */
  private renderDeleteDialog = (): JSX.Element => {
    const { classes } = this.props;
    const { routeToDelete, deleteDialogVisible } = this.state;

    return (
      <Dialog
        open={ deleteDialogVisible }
        onClose={ this.closeDeleteDialog }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { strings.deleteConfirm }
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesFrom }: { routeToDelete?.locationFromName }
          </DialogContentText>

          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesTo }: { routeToDelete?.locationToName }
          </DialogContentText>

          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesSavedText }:  { routeToDelete ? this.dateToYMD(routeToDelete.savedAt!) : "" }
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {
            !this.state.deletingRoute &&
            <Button variant="contained" className={ classes.errorButton } onClick={ this.deleteRoute }>
              { strings.yes }
            </Button>
          }
          {
            this.state.deletingRoute &&
            <CircularProgress className={ classes.errorLoader } />
          }

          <Button variant="contained" className={ classes.warningButton } onClick={ this.closeDeleteDialog } color="primary" autoFocus>
            { strings.cancel }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Converts Date to a string in YY-MM-DD format
   * 
   * @param date A date to convert
   * 
   * @returns A string in YY-MM-DD format
   */
  private dateToYMD = (date: Date): string => {
    return date.toISOString().split("T")[0];
  }

  /**
   * Deletes a route
   */
  private deleteRoute = async () => {
    const { accessToken } = this.props;
    const { routeToDelete } = this.state;

    if (!accessToken || !routeToDelete) {
      return;
    }

    this.setState({ deletingRoute: true });

    try {
      const routesApi = Api.getRoutesApi(accessToken);
      await routesApi.deleteRoute({ routeId: routeToDelete.id! });
      await this.updateRoutesList();
      this.setState({ deleteDialogVisible: false });
    } catch (error) {
      console.log(error);
    }

    this.setState({ deletingRoute: false });
  }

  /**
   * Closes the delete dialog
   * 
   */
  private closeDeleteDialog = () => {
    this.setState({
      deleteDialogVisible: false,
      routeToDelete: undefined
    });
  }

  /**
   * Opens the delete dialog
   * 
   * @param routeToDelete a route to delete
   */
  private openDeleteDialog = (routeToDelete: Route) => {
    this.setState({
      deleteDialogVisible: true,
      routeToDelete
    });
  }
}

/**
 * Redux mapper for mapping store state to component props
 * @param state store state
 */
export function mapStateToProps(state: ReduxState) {
  return {
    accessToken: state.auth.accessToken
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    updateDisplayedRoute: (displayedRoute?: Route) => dispatch(actions.setDisplayedRoute(displayedRoute))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedRoutes));