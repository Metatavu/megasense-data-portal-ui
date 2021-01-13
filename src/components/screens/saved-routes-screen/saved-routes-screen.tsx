import React from "react";

import Api from "../../../api";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { styles } from "./saved-routes.styles";
import { NullableToken } from "../../../types";
import { Route } from "../../../generated/client";
import * as actions from "../../../actions/route";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import AppLayout from "../../layouts/app-layout/app-layout";
import { Container, Card, CardContent, CardActions, withStyles, Button, Typography, WithStyles, CircularProgress } from "@material-ui/core";
import ConfirmDialog from "../../generic/dialogs/confirm-dialog";
import moment from "moment";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {}

interface Props {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
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
  redirect?: string;
  error?: string | Error | Response;
}

/**
 * Component for saved routes screen
 */
class SavedRoutesScreen extends React.Component<Props, State> {

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
      loadingRoutes: false
    };
  }

  /**
   * Component life cycle method
   */
  public componentDidMount = async () => {
    await this.updateRoutesList();
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
            { strings.savedRoutes }
          </Typography>
          {
            this.renderRouteCards()
          }
          <ConfirmDialog 
            title={ strings.deleteConfirm } 
            positiveButtonText={ strings.common.yes } 
            cancelButtonText={ strings.common.cancel } 
            dialogVisible={ deleteDialogVisible } 
            onDialogConfirm={ this.deleteRoute } 
            onDialogCancel={ this.closeDeleteDialog } />
        </Container>
      </AppLayout>
    );
  }

  /**
   * Renders route cards
   * 
   * @returns a rendered route cards
   */
  private renderRouteCards = () => {
    const { classes } = this.props;
    const { routes, loadingRoutes } = this.state;
    if (!loadingRoutes) {
      return (
        <>
          { routes.map(this.renderRouteCard) }
        </>
      );
    }

    return(
      <CircularProgress className={ classes.primaryLoader } />
    );
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
            { strings.savedRoutesSavedText }: { this.dateToDMY(route.savedAt!) }
            </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" size="small" onClick={ () => this.displayRoute(route) }>{ strings.viewRoute }</Button>
          <Button variant="contained" className={ classes.errorButton } size="small" onClick={ () => this.openDeleteDialog(route) }>{ strings.deleteRoute }</Button>
        </CardActions>
      </Card>
    );
  }

  /**
   * Display route method
   */
  private displayRoute = (route: Route) => {
    this.props.updateDisplayedRoute(route);
    this.setState({ redirect: "/map" });
  } 

  /**
   * Converts Date to a localized string in DD-MMMM-YYYY format
   * 
   * @param date A date to convert
   * 
   * @returns A localized string in DD-MMMM-YYYY format
   */
  private dateToDMY = (date: Date): string => {
    return moment(date).format("LL");
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
      this.setState({
        error: error
      });
    }

    this.setState({ deletingRoute: false });
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
      this.setState({
        error: error
      });
    }

    this.setState({ loadingRoutes: false });
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
    updateDisplayedRoute: (displayedRoute?: Route) => dispatch(actions.setDisplayedRoute(displayedRoute))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedRoutesScreen));
