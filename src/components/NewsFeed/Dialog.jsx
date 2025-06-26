import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MUIDialog,
} from "@mui/material";
import { hideDialog } from "@redux/slices/dialogSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Dialog = () => {
  const dispatch = useDispatch();

  const { open, maxWidth, fullWidth, title, content, actions } = useSelector(
    (state) => state.dialog,
  );

  return (
    <MUIDialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={() => dispatch(hideDialog())}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
