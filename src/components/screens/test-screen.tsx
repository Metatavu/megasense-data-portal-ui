import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../actions";
import strings from "../../localization/strings";
import { AccessToken, StoreState } from "../../types";

/**
 * Interface describing component props
 */
interface Props {
  accessToken?: AccessToken;
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * Component for warehouses screen
 */
class TestScreen extends React.Component<Props, State> {

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

  /**
   * Component render method
   */
  render() {


    return (
      <div>
        <h1>{ strings.yourTokenIs }</h1>
        <p>{ this.props.accessToken?.token }</p>
      </div>
    
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
    accessToken: state.accessToken
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

export default connect(mapStateToProps, mapDispatchToProps)(TestScreen);