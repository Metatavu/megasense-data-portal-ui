import { Box, Drawer, Toolbar } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect } from "react-router-dom";
import { NullableToken } from "../../../types";
import ErrorDialog from "../../generic/dialogs/error-dialog";
import Header from "../../generic/header/header";
import Settings from "../../settings/settings";
import { styles } from "./app-layout.styles";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  hideHeader?: boolean;
  error?: string | Error | Response;
  clearError?: () => void;
  redirectTo?: string;
  showDrawer?: boolean;
  drawerContent?: JSX.Element;
}

interface State {
  showSettings?: boolean;
}

/**
 * AppLayout component
 */
class AppLayout extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const {
      accessToken,
      keycloak,
      routing,
      classes,
      children,
      hideHeader,
      showDrawer
    } = this.props;
    
    return (
      <>
        <div className={ classes.root }>
          { !hideHeader &&
            <>
              <Header
                accessToken={ accessToken }
                keycloak={ keycloak }
                routing={ routing }
                onSettingsClick={ this.onSettingsClick }
              />
              <Toolbar />
            </>
          }
          <div className={ `${classes.content} ${ showDrawer ? classes.hasDrawer : ""}` }>
            { children }
          </div>
          { this.routeRedirect() }
          { this.renderLeftSideDrawer() }
          { this.renderSettings() }
        </div>
        { this.renderErrorDialog() }
      </>
    );
  }

  /**
   * Toggle settings open click handler
   */
  private onSettingsClick = () => {
    this.setState({
      showSettings: true
    });
  }

  /**
   * Toggle settings open click handler
   */
  private handleSettingsClose = () => {
    this.setState({
      showSettings: false
    });
  }

  /**
   * Renders settings drawer
   */
  private renderSettings = () => {
    const { classes } = this.props;
    const { showSettings } = this.state;
    return(
      <Drawer
        open={ showSettings }
        variant="temporary"
        anchor="right"
        classes={{
          paper: classes.drawer,
        }}
      >
        <Settings onSettingsCloseClick={ this.handleSettingsClose } />
      </Drawer>
    );
  }

  /**
   * Renders left side drawer
   */
  private renderLeftSideDrawer = () => {
    const { classes, showDrawer, drawerContent } = this.props;
    return(
      <Drawer
        open={ showDrawer }
        variant="persistent"
        anchor="left"
        classes={{
          paper: classes.drawer,
        }}
      >
        { drawerContent }
      </Drawer>
    );
  }

  /**
   * Renders error dialog
   */
  private renderErrorDialog = () => {
    if (this.props.error && this.props.clearError) {
      return <ErrorDialog error={ this.props.error } onClose={ this.props.clearError } />;
    }

    return null;
  }

  /**
   * Handles recieved route redirection
   */
  private routeRedirect = () => {
    const { redirectTo } = this.props;
    if (!redirectTo) {
      return null;
    }
    
    return (
      <Redirect to={ redirectTo } push={ true }/>
    );
  }
}

export default withStyles(styles)(AppLayout)
