import React from "react";
import { AppBar, Box, Button, IconButton, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import { styles } from "./settings.styles";
import CloseIcon from "@material-ui/icons/Close";
import strings from "../../localization/strings";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  onSettingsCloseClick: () => void;
}

/**
 * Interface describing component state
 */
interface State {
  settingsOpen: boolean;
}

/**
 * Component for settings
 */
class Settings extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      settingsOpen: false
    };
  }

  /**
   * Settings render method
   */
  public render = () => {
    const { onSettingsCloseClick } = this.props;

    return (
      <>
        <AppBar position="relative">
          <Toolbar>
            <Box 
              display="flex"
              flex="1"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">{ strings.settings.title }</Typography>
              <Box>
                <Button
                  disabled={ true }
                  color="inherit"
                  variant="text"
                >
                  { strings.common.save }
                </Button>
                <IconButton
                  color="inherit"
                  onClick={ onSettingsCloseClick }
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box p={ 3 }>
          {/* Settings content here */}
        </Box>
      </>
    );
  }
}

export default withStyles(styles)(Settings);
