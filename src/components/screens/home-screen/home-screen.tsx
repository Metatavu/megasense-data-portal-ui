import React from "react";

import { Dispatch } from "redux";
import { History } from "history";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Typography, WithStyles, withStyles, Button, Grid } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";
import styles from "./home-screen.styles";
import Logo from "../../../../src/resources/images/logo.png";
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
  morining: Number,
  noon: Number,
  evening: Number
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
      morining: 6,
      noon: 12,
      evening: 19
    };
  }

  /**
   * Component life cycle method
   */
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
    const { redirectTo } = this.state;
    const userName = accessToken?.userName || strings.user.toLowerCase();

    if (accessToken) {
      return (
        <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
          <Grid container className={ classes.backgroundContainer }>
            <Typography className={ classes.title } variant="h2">
              { this.greeting()  + ", " + userName  }
            </Typography>
          </Grid>
        </AppLayout>
      );
    }

    return (
      <AppLayout
        accessToken={ accessToken }
        keycloak={ keycloak }
        hideHeader={ true }
        redirectTo={ redirectTo }>
        <Grid container className={ classes.backgroundContainer }>
          <Grid container className={ classes.noticeGrid }>
            <Typography variant="h3" className={ classes.noticeText }>
              { strings.errorDialog.notice }
            </Typography>
          </Grid>
          <Grid container className={ classes.loginGrid }>
            <img alt="logo" src={ Logo } className={ classes.logoBig } />
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
              onClick={ () => this.onRegisterButtonClick() }
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
   * Method for greeting message
   */
  private greeting = () =>{
    const hour = new Date().getHours();
    if(hour >= this.state.morining && hour < this.state.noon){
      return strings.welcome.goodMorning;
    }else if (hour >= this.state.noon && hour < this.state.evening){
      return strings.welcome.goodAfternoon;
    }else{
      return strings.welcome.goodEvening;
    }
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

  /**
   * Method for registering a new user
   */
  private onRegisterButtonClick = () => {
    this.setState({ 
      redirectTo: "/registration"
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
