import React, { ChangeEventHandler } from "react";

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

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
}

/**
 * Interface describing component state
 */
interface State {
  redirectTo?: string;
  passwordLabel: string;
  formData: FormData;
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
      formData: {
        name: "",
        email: "",
        password: "",
        passwordCheck: "",
      },
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
    const { classes, accessToken, keycloak } = this.props;
    const { redirectTo, passwordLabel, formData } = this.state;
    const { name, email, password, passwordCheck } = formData;

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
          <Grid container className={ classes.registerGrid }>
            <img alt="logo" src={ Logo }/>
            { this.inputBox(strings.auth.name, name, "name") }
            { this.inputBox(strings.auth.email, email, "email", "email") }
            { this.inputBox(strings.auth.password, password, "password", "password") }
            { this.inputBox(strings.auth.repeatPassword, passwordCheck, "passwordCheck", "password") }
            <InputLabel className={ classes.registerWarning} htmlFor="input-with-icon-adornment">{ passwordLabel }</InputLabel>
            <Button 
              variant="outlined" 
              className={ classes.registerButton }
              onClick={ this.onRegisterButtonClick }
            >
              { strings.auth.register }
            </Button>
          </Grid>
        </Grid>
      </AppLayout>
    );
  }

  /**
   * Renders input box
   * 
   * @param inputCaption input caption
   * @param inputValue input value
   * @param inputName input name
   * @param inputType input type
   */
  private inputBox= (inputCaption: string, inputValue: string, inputName: string, inputType?: string) => {
    const { classes } = this.props;

    return (
      <Grid container className={ classes.registerGridInput }>
        <Typography 
          variant="caption" 
          component="p" 
          className={ classes.registerGrid }
        >
          { inputCaption }
        </Typography>
        <Input
          className={ classes.registerGrid }
          value={ inputValue }
          name={ inputName }
          type={ inputType }
          onChange={ this.handleInputChange }
        />
      </Grid>
    )
  }

  /**
   * Event handler for input change
   */
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { formData } = this.state;
    const { name, value } = event.target;

    if (!name) {
      return;
    }

    this.setState({
      formData: { ...formData, [name]: value }
    });
  }

  /**
   * Method for registering a new user
   */
  private onRegisterButtonClick = async () => {
    const { accessToken } = this.props;
    const { name, email, password, passwordCheck } = this.state.formData;

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
