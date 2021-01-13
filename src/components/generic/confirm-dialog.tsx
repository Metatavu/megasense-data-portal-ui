import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, WithStyles, withStyles } from "@material-ui/core";
import { styles } from "./confirm-dialog.styles";
import React from "react";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  title: string;
  text?: string;
  positiveButtonText: string;
  cancelButtonText: string;
  dialogVisible: boolean;
  onDialogConfirm: () => void;
  onDialogCancel: () => void;
}

/**
 * Interface describing component state
 */
interface State {}

/**
 * Component for generic confirm dialogue
 */
class ConfirmDialogue extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {};
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes, dialogVisible, onDialogConfirm, onDialogCancel, title, text, positiveButtonText, cancelButtonText } = this.props;

    return (
      <Dialog
        open={ dialogVisible }
        onClose={ onDialogCancel }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { title }
        </DialogTitle>
        <DialogContent>
          { text &&
            <DialogContentText id="alert-dialog-description">
              { text }
            </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button variant="contained" className={ classes.errorButton } onClick={ onDialogConfirm }>
            { positiveButtonText }
          </Button>
          <Button variant="contained" className={ classes.warningButton } onClick={ onDialogCancel } color="primary" autoFocus>
            { cancelButtonText }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ConfirmDialogue);
