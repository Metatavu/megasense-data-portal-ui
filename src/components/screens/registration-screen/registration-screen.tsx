import React from "react";

import { Dispatch } from "redux";
import { History } from "history";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Typography, WithStyles, withStyles, Button, Grid, Input, InputLabel } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";
import styles from "./registration-screen.styles";
import Logo from "../../../../src/resources/images/logo.png";
import Api from "../../../api";

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
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
  passwordLabel: string;
}

/**
 * Component for registration screen
 */
class RegistrationScreen extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      passwordLabel: ""
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
    const { redirectTo, name, email, password, passwordCheck, passwordLabel } = this.state;

    return (
      <AppLayout
        accessToken={ accessToken }
        keycloak={ keycloak }
        hideHeader={ true }
        redirectTo={ redirectTo }>
        <Grid container className={ classes.backgroundContainer }>
          <h1 style={{ color: "white" }}>This website is under development and is only for Megasense consortium members. Please leaave it if you are not a part of Megasense consortium</h1>
          <Grid container className={ classes.registerGrid }>
            <img alt="logo" src={ Logo } className={ classes.logoBig } />
            <div>
              <Typography variant="caption" component="p">
                { strings.auth.name }
              </Typography>
              <Input aria-label="Test" value={ name } onChange={ event => this.setState({ name: event.target.value }) }></Input>
            </div>
            <div>
              <Typography variant="caption" component="p">
                { strings.auth.email }
              </Typography>
              <Input type="email" value={ email } onChange={ event => this.setState({ email: event.target.value }) }></Input>
            </div>
            <div>
              <Typography variant="caption" component="p">
                { strings.auth.password }
              </Typography>
              <Input type="password" value={ password } onChange={ event => this.setState({ password: event.target.value }) }></Input>
            </div>
            <div>
              <Typography variant="caption" component="p">
                { strings.auth.repeatPassword }
              </Typography>
              <Input type="password" value={ passwordCheck } onChange={ event => this.setState({ passwordCheck: event.target.value }) }></Input>
            </div>
            <InputLabel htmlFor="input-with-icon-adornment">{ passwordLabel }</InputLabel>
            <Button 
              variant="outlined" 
              className={ classes.registerButton }
              onClick={ () => this.onRegisterButtonClick() }
            >
              { strings.auth.register }
            </Button>
          </Grid>
        </Grid>
      </AppLayout>
    );
  }

  /**
   * Method for registering a new user
   */
  private onRegisterButtonClick = async () => {
    const { keycloak, accessToken } = this.props;
    const { name, email, password, passwordCheck } = this.state;

    if (password !== passwordCheck) {
      this.setState({
        passwordLabel: strings.auth.passwordCheckFail
      });
      return;
    } else {
      this.setState({
        passwordLabel: ""
      });
    }

    const usersApi = Api.getUsersApi(accessToken);
    try {
      await usersApi.createUser({
        user: {
          name: name,
          email: email,
          showMobileWelcomeScreen: true,
          pollutantPenalties: [],
          password: password
        }
      }).then(() => {
        this.setState({
          redirectTo: "/"
        });
      });
    } catch (e) {
      console.error("User creation error: ", e);
    }
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

const Styled = withStyles(styles)(RegistrationScreen);

export default connect(mapStateToProps, mapDispatchToProps)(Styled);
