import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Dialog,Box,DialogTitle,DialogContent,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function FormDialog(props: any) {

  return (
    <div>

      <Dialog
        onClose={props.handleCloseFormDialog}
        aria-labelledby="customized-dialog-title"
        open={props.show}
        fullWidth={true}
        maxWidth={"lg"}
      >

        <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleCloseFormDialog}>
          {props.title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
        
            {props.children}
         
        </DialogContent>

      </Dialog>
    </div>
  );
}
