import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
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
    const { classes, children } = this.props;
    
    return (
      <div className={ classes.root }>
        <Header
          routing={ this.props.routing }
          toggleSideMenu={ this.toggleSideMenu }
        />
        {/* Empty toolbar to add correct spacing to prevent the content to go below the App header */}
        <Toolbar />
        <div className={ classes.content }>
          { children }
        </div>
      </div>
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
