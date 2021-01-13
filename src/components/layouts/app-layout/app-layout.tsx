import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";
import { NullableToken } from "../../../types";
import ErrorDialog from "../../generic/dialogs/error-dialog";
import { Redirect } from "react-router-dom";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  error?: string | Error | Response;
  clearError?: () => void;
  redirectTo?: string
}

interface State {
  sideMenuOpen: boolean;
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
      sideMenuOpen: false
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { accessToken, keycloak, classes, children } = this.props;
    
    return (
      <div className={ classes.root }>
        <Header
          accessToken={ accessToken }
          keycloak={ keycloak }
          routing={ this.props.routing }
          toggleSideMenu={ this.toggleSideMenu }
        />
        <Toolbar />
        <div className={ classes.content }>
          { children }
        </div>
        { this.routeRedirect() }
        { this.renderErrorDialog() }
      </div>
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

  private toggleSideMenu = () => {
    const sideMenuOpen = !this.state.sideMenuOpen;
    this.setState({ 
      sideMenuOpen: sideMenuOpen 
    });
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
