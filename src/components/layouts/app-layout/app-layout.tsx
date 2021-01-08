import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";
import { connect } from "react-redux";
import { ReduxActions, ReduxState } from "../../../store";
import { Dispatch } from "redux";
import { NullableToken } from "../../../types";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  children: React.ReactNode;
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
    const { classes, children, keycloak, accessToken } = this.props;
    
    return (
      <div className={ classes.root }>
        <Header
          routing={ this.props.routing }
          toggleSideMenu={ this.toggleSideMenu }
          keycloak={ keycloak }
          accessToken={ accessToken }
        />
        {/* Empty toolbar to add correct spacing to prevent the content to go below the App header */}
        <Toolbar />
        <div className={ classes.content }>
          { children }
        </div>
      </div>
    );
  }

  private toggleSideMenu = () => {
    const sideMenuOpen = !this.state.sideMenuOpen;
    this.setState({ 
      sideMenuOpen: sideMenuOpen 
    });
  }
}

/**
 * Redux mapper for mapping store state to component props
 * 
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
  return {}
 }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppLayout));

