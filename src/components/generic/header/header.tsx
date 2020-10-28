import { AppBar, Box, Button, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./header.styles";
import { Link } from "react-router-dom";
import strings from "../../../localization/strings";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  toggleSideMenu: () => void;
  routing?: JSX.Element
}

/**
 * Interface describing component state
 */
interface State {

}

class MobileTopBar extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {

    };
  }

  public render = () => {
    const { classes } = this.props;
    return (
      <>
        <AppBar position="fixed" className={ classes.appBar }>
          <Toolbar>
            <Box ml={ 2 } mr={ 2 }>
              <Link to="/">
                <Button variant="outlined">
                  { strings.frontPage }
                </Button>
              </Link>
            </Box>
            <Box mr={ 2 }>
              <Link to="/map">
                <Button variant="outlined">
                  { strings.map }
                </Button>
              </Link>
            </Box>
            <Box mr={ 2 }>
              <Link to="/statistics">
                <Button variant="outlined">
                  { strings.statistics }
                </Button>
              </Link>
            </Box>
            <Box>
              <Link to="/settings">
                <Button variant="outlined">
                  { strings.settings }
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}

export default withStyles(styles)(MobileTopBar);