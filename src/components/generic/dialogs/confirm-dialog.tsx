import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, WithStyles, withStyles } from "@material-ui/core";
import { styles } from "./dialog.styles";
import React, { ReactNode } from "react";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  title: string;
  text?: string | ReactNode;
  userInput?: () => JSX.Element;
  positiveButtonText?: string;
  cancelButtonText: string;
  dialogVisible: boolean;
  onDialogConfirm?: () => void;
  onDialogCancel: () => void;
}

/**
 * Interface describing component state
 */
interface State {}

/**
 * Component for generic confirm dialog
 */
class ConfirmDialog extends React.Component<Props, State> {

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
    const { classes, dialogVisible, onDialogConfirm, onDialogCancel, title, text, userInput, positiveButtonText, cancelButtonText } = this.props;

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
          { userInput &&
            userInput()
          }
        </DialogContent>
        <DialogActions className={ classes.dialogButtonRow }>
          <Button 
            variant="text"
            className={ classes.warningButton }
            onClick={ onDialogCancel }
            color="primary" 
            autoFocus
          >
            { cancelButtonText }
          </Button>
          { positiveButtonText && <Button
              variant="contained"
              className={ classes.primaryButton }
              onClick={ onDialogConfirm }
            >
              { positiveButtonText }
            </Button>
          }
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ConfirmDialog);
