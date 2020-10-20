import { Container, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";

/**
 * Interface describing component props
 */
interface Props {
  accessToken?: AccessToken;
  keycloak?: Keycloak.KeycloakInstance
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
      return
    }

    const userDisplayName = (keycloak.idTokenParsed as any).name;
    if (userDisplayName) {
      this.setState({ userDisplayName });
    }
  }

  /**
   * Component render method
   */
  render() {
    const { userDisplayName } = this.state;
    return (
      <AppLayout>
        <Container>
        <Typography variant="h3">
          { strings.hello } { userDisplayName }
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
export function mapStateToProps(state: StoreState) {
  return {
    accessToken: state.accessToken,
    keycloak: state.keycloak
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);