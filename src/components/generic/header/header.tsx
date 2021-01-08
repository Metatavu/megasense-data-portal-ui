import React from "react";
import { AppBar, Box, Button, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import strings from "../../../localization/strings";
import { NullableToken } from "../../../types";
import { styles } from "./header.styles";
import { Link } from "react-router-dom";
import LogoIcon from "../../../resources/svg/logo-icon";
import StatsIcon from "@material-ui/icons/ShowChart";
import MapIcon from "@material-ui/icons/Map";
import SettingsIcon from "@material-ui/icons/Settings";

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
interface State { 
}

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
            <LogoIcon color="primary" />
            <Box ml={ 2 } mr={ 2 }>
              <Typography variant="h1" color="primary">Green paths</Typography>
            </Box>
            <Box ml={ 2 } mr={ 2 }>
              <Link to="/map">
                <Button
                  startIcon={ <MapIcon /> }
                  color="primary"
                  variant="contained"
                >
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
          color="primary"
          variant="text"
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
          <Button
            startIcon={ <StatsIcon /> }
            variant="outlined"
          >
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
          <Button
            variant="outlined"
            startIcon={ <SettingsIcon /> }
          >
            { strings.settings }
          </Button>
        </Link>
      </Box>
    );
  }

}

export default withStyles(styles)(MobileTopBar);
