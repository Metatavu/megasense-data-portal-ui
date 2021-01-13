import React from "react";

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Container, Typography } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";

/**
 * Interface describing component props
 */
interface Props {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
}

/**
 * Interface describing component state
 */
interface State {
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
    const { accessToken, keycloak } = this.props;
    const userName = accessToken?.userName || strings.user.toLowerCase();

    return (
      <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
        <Container>
        <Typography variant="h3">
          { strings.hello } { userName }
        </Typography>
        </Container>
      </AppLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
