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
  userDisplayName: string;
}

/**
 * Component for warehouses screen
 */
class Home extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      userDisplayName: strings.user.toLowerCase()
    };
  }

  public componentDidMount = () => {
    const { accessToken, keycloak } = this.props;

    if (!accessToken || !keycloak) {
      return;
    }

    const userDisplayName = (keycloak.idTokenParsed as any).name;
    if (userDisplayName) {
      this.setState({ userDisplayName });
    }
  }

  /**
   * Component render method
   */
  public render() {
    const { classes } = this.props;
    const { accessToken, keycloak } = this.props;
    const { userDisplayName } = this.state;
    
    if (accessToken) {
      return (
        <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
          <Grid container className={ classes.backgroundContainer }>
            <Typography className={ classes.title } variant="h3">
              { strings.hello } { userDisplayName }
            </Typography>
          </Grid>
        </AppLayout>
      );
    }

    return (
      <AppLayout accessToken={ accessToken } keycloak={ keycloak } hideHeader={ true }>
        <Grid container className={ classes.backgroundContainer }>
          <Grid container className={ classes.loginGrid }>
            <img src={ Logo } className={ classes.logoBig } />  
            <Button 
              variant="outlined" 
              className={ classes.logInButton }
              endIcon={ <ArrowIcon /> }
              onClick={ () => {
                if (keycloak) {
                  keycloak.login({ idpHint: "oidc" });
                }
              }}
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
              onClick={ this.navigateTo("/map") }
            >
              { strings.auth.guestUser }
            </Button>
          </Grid>
        </Grid>
      </AppLayout>
    );
  }

  /**
   * Navigate to given route path
   * 
   * @param path path as string
   */
  private navigateTo = (path : string) => () => {
    const { history } = this.props;
    history.push(path);
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

const Styled = withStyles(styles)(Home);

export default connect(mapStateToProps, mapDispatchToProps)(Styled);
