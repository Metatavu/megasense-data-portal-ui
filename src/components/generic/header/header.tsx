import React from "react";

import { AppBar, Box, Button, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import { ReduxActions, ReduxState } from "../../../store";
import strings from "../../../localization/strings";
import { NullableToken } from "../../../types";
import { styles } from "./header.styles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  toggleSideMenu: () => void;
}

/**
 * Interface describing component state
 */
interface State { }

class MobileTopBar extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = { };
  }

  public render = () => {
    const { classes } = this.props;
    return (
      <>
        <AppBar position="fixed" className={ classes.appBar }>
          <Toolbar>
            <Box ml={ 2 } mr={ 2 }>
              <Link to="/">
                <Button variant="outlined">
                  { strings.frontPage }
                </Button>
              </Link>
            </Box>
            <Box mr={ 2 }>
              <Link to="/map">
                <Button variant="outlined">
                  { strings.map }
                </Button>
              </Link>
            </Box>
            { this.renderStatistics() }
            { this.renderSettings() }
            { this.renderAuthAction() }
          </Toolbar>
        </AppBar>
      </>
    );
  }

  /**
   * Method for rendering user auth action
   */
  private renderAuthAction = () => {
    const { accessToken, keycloak } = this.props;

    const label = accessToken ?
      strings.auth.logout :
      strings.auth.login;

    return (
      <Box style={{ marginLeft: "auto" }}>
        <Button
          variant="outlined"
          onClick={ () => {
            if (accessToken) {
              if (keycloak) {
                keycloak.logout();
              }
            } else {
              if (keycloak) {
                keycloak.login({idpHint: "oidc"});
              }
            }
          }}
        >
          { label }
        </Button>
      </Box>
    );
  }

  /**
   * Method for rendering statistics
   */
  private renderStatistics = () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return null;
    }

    return (
      <Box mr={ 2 }>
        <Link to="/statistics">
          <Button variant="outlined">
            { strings.statistics }
          </Button>
        </Link>
      </Box>
    );
  }

  /**
   * Method for rendering settings
   */
  private renderSettings = () => {
    const { accessToken } = this.props;
    
    if (!accessToken) {
      return null;
    }

    return (
      <Box>
        <Link to="/settings">
          <Button variant="outlined">
            { strings.settings }
          </Button>
        </Link>
      </Box>
    );
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
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MobileTopBar));