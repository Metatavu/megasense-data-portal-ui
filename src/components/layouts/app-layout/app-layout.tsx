import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";
import { NullableToken } from "../../../types";
import ErrorDialogue from "../../generic/error-dialog";
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

class AppLayout extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      sideMenuOpen: false
    };
  }

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
        {/* Empty toolbar to add correct spacing to prevent the content to go below the App header */}
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
      return <ErrorDialogue error={ this.props.error } onClose={ this.props.clearError } />;
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
   * 
   * @param route route string
   */
  private routeRedirect = () => {
    const { redirectTo } = this.props;
    if (redirectTo) {
      return (
        <Redirect to={ redirectTo } push={ true }/>
      );
    }

    return null;
  }
}

export default withStyles(styles)(AppLayout)
