import * as React from "react";
import strings from "../../../localization/strings";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, WithStyles, withStyles } from "@material-ui/core";
import { styles } from "./dialog.styles";
import { ReactNode } from "react";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  title?: string;
  content?: ReactNode;
  dialogVisible: boolean
  onClose: () => void;
}

/**
 * React component displaying error dialogs
 */
class WaringDialog extends React.Component<Props> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
  }

  /** 
   * Component render method
   */
  public render() {
    const { title, content, dialogVisible, onClose, classes } = this.props;

    return (
      <Dialog
        open={ dialogVisible }
        onClose={ onClose }
      >
        { title && <DialogTitle id="warning-dialog-title">
            { title }
          </DialogTitle>
        }
        { content && <DialogContent>
            <DialogContentText id="warning-dialog-description">
              { content }
            </DialogContentText>
          </DialogContent>
        }
        <DialogActions className={ classes.dialogButtonRow }>
          <Button
            variant="contained"
            className={ classes.primaryButton }
            onClick={ onClose }
          >
            { strings.warningDialog.close }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(WaringDialog);