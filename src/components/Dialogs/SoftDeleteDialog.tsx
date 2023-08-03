
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = (props: any) => {

  return (
    <Dialog
      open={props.isDialogOpen}
      onClose={props.closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.desc}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeDialog}>
          {props.cancelText}
        </Button>
        <Button onClick={props.agreeDialog} autoFocus>
          {props.agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

