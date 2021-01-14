import React from "react";

import { Dispatch } from "redux";
import { History } from "history";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Typography, WithStyles, withStyles, Button, Grid } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";
import styles from "../../../styles/screens/home";
import Logo from "../../../../src/images/logo.png";
import ArrowIcon from "@material-ui/icons/ArrowForward";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  history: History<History.LocationState>;
}

/**
 * Interface describing component state
 */
interface State {
  redirectTo?: string;
}

/**
 * Component for home screen
 */
class HomeScreen extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public componentDidMount = () => {
    const { accessToken, keycloak } = this.props;

    if (!accessToken || !keycloak) {
      return;
    }
  }

  /**
   * Component render method
   */
  public render() {
    const { classes } = this.props;
    const { accessToken, keycloak } = this.props;
    const userName = accessToken?.userName || strings.user.toLowerCase();

    if (accessToken) {
      return (
        <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
          <Grid container className={ classes.backgroundContainer }>
            <Typography className={ classes.title } variant="h3">
              { strings.hello } { userName }
            </Typography>
          </Grid>
        </AppLayout>
      );
    }

    return (
      <AppLayout accessToken={ accessToken } keycloak={ keycloak } hideHeader={ true } redirectTo={ this.state.redirectTo }>
        <Grid container className={ classes.backgroundContainer }>
          <Grid container className={ classes.loginGrid }>
            <img src={ Logo } className={ classes.logoBig } />
            <Button 
              variant="outlined" 
              className={ classes.logInButton }
              endIcon={ <ArrowIcon /> }
              onClick={ () => this.onLoginButtonClick() }
            >
              { strings.auth.login }
            </Button>
            <Button 
              variant="outlined" 
              className={ classes.logInButton }
              endIcon={ <ArrowIcon /> }
            >
              { strings.auth.register }
            </Button>
            <Button 
              variant="text"
              className={ classes.logInButton }
              onClick={ () => this.onGuestButtonClick() }
            >
              { strings.auth.guestUser }
            </Button>
          </Grid>
        </Grid>
      </AppLayout>
    );
  }

  /**
   * Method for logging in
   */
  private onLoginButtonClick = () => {
    const { keycloak } = this.props;
    if (keycloak) {
      keycloak.login({ idpHint: "oidc" });
    }
  }

  /**
   * Method for continuing in as a guest user
   */
  private onGuestButtonClick = () => {
    this.setState({ 
      redirectTo: "/map"
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
  return {
  };
}

const Styled = withStyles(styles)(HomeScreen);

export default connect(mapStateToProps, mapDispatchToProps)(Styled);
