import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";
import { NullableToken } from "../../../types";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  hideHeader?: boolean;
}

interface State {
  sideMenuOpen: boolean;
}

class AppLayout extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      sideMenuOpen: false
    };
  }

  public render = () => {
    const { classes, children, hideHeader } = this.props;
    
    return (
      <div className={ classes.root }>
        { !hideHeader &&
          this.renderHeader()
        }
        <div className={ classes.content }>
          { children }
        </div>
      </div>
    );
  }

  private renderHeader = () => {
    const { accessToken, keycloak, routing } = this.props;
    return (
      <>
        <Header
          accessToken={ accessToken }
          keycloak={ keycloak }
          routing={ routing }
          toggleSideMenu={ this.toggleSideMenu }
        />
        <Toolbar />
     </>
    );
  }

  private toggleSideMenu = () => {
    const sideMenuOpen = !this.state.sideMenuOpen;
    this.setState({ 
      sideMenuOpen: sideMenuOpen 
    });
  }
}

export default withStyles(styles)(AppLayout)
