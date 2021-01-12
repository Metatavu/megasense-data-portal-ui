import * as React from "react";

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NullableToken } from "../../types";
import { setKeycloak, login } from "../../actions/auth";

import { ReduxState, ReduxActions } from "../../store";
import Keycloak, { KeycloakInstance } from "keycloak-js";

/**
 * Component props
 */
interface Props {
  children?: React.ReactNode;
  accessToken?: NullableToken;
  setKeycloak: typeof setKeycloak;
  onLogin: typeof login;
  getActiveUserName: (name: string) => void;
}

/**
 * Component state
 */
interface State { }

/**
 * Component providing access token and keeping it fresh
 */
class AccessTokenProvider extends React.Component<Props, State> {

  /**
   * Keycloak instance
   */
  private keycloak: KeycloakInstance;
  /**
   * Refresh token timer
   */
  private timer?: NodeJS.Timer;

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.keycloak = Keycloak({
      url: process.env.REACT_APP_KEYCLOAK_URL,
      realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
    });
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const auth = await this.keycloakInit();
    this.props.setKeycloak(this.keycloak);
    if (auth) {
      const { token, tokenParsed } = this.keycloak;

      if (this.keycloak && tokenParsed && tokenParsed.sub && token) {
        await this.keycloak.loadUserProfile();
        const signedToken = this.buildToken(this.keycloak);
        this.props.onLogin(signedToken ?? null);
        const userDisplayName: string = (this.keycloak.idTokenParsed as any).name;
        if (userDisplayName) {
          this.props.getActiveUserName(userDisplayName);
        }
      }

      this.refreshAccessToken();

      this.timer = setInterval(() => {
        this.refreshAccessToken();
      }, 1000 * 60);
    } else {
      this.props.onLogin(null);
    }
  }

  /**
   * Component will unmount life cycle event
   */
  public componentWillUnmount = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Component render method
   */
  public render = () => {
    const { accessToken, children } = this.props;

    return accessToken !== undefined ? children : null;
  }

  /**
   * Refreshes access token
   */
  private refreshAccessToken = () => {
    try {
      const refreshed = this.keycloak.updateToken(70);
      if (refreshed) {
        const nullableToken = this.buildToken(this.keycloak);
        this.props.onLogin(nullableToken);
      }
    } catch (e) {
      this.setState({
        error: e
      });
    }
  }

  /**
   * Initializes Keycloak client
   */
  private keycloakInit = () => {
    return new Promise(resolve => {
      this.keycloak.init({ onLoad:"check-sso", checkLoginIframe: false }).success(resolve);
    });
  }

  /**
   * Builds access token using Keycloak instance
   *
   * @param keycloak Keycloak instance
   * @returns access token or undefined if building fails
   */
  private buildToken = (keycloak: KeycloakInstance): NullableToken => {
    const { token, tokenParsed, refreshToken, refreshTokenParsed, profile } = keycloak;
    if (!tokenParsed || !tokenParsed.sub || !token) {
      return null;
    }

    const created = new Date();

    return {
      created: created,
      access_token: token,
      expires_in: tokenParsed.exp,
      refresh_token: refreshToken,
      refresh_expires_in: refreshTokenParsed?.exp,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      userId: tokenParsed.sub,
      email: profile?.email
    };
  }
}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  onLogin: (accessToken: NullableToken) => dispatch(login(accessToken)),
  setKeycloak: (keycloak: KeycloakInstance) => dispatch(setKeycloak(keycloak))
});

export default connect(mapStateToProps, mapDispatchToProps)(AccessTokenProvider);