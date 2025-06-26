import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MUIDialog,
  TextField,
} from "@mui/material";
import { hideDialog } from "@redux/slices/dialogSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageUploader } from "./PostCreation";

const NewPostDialog = () => {
  return (
    <div>
      <TextField fullWidth size="small" placeholder="What's on your mind?" />
      <ImageUploader />
    </div>
  );
};

const DynamicContent = ({ contentType }) => {
  switch (contentType) {
    case "newPost":
      return <NewPostDialog />;
    default:
      return <p></p>;
  }
};

const Dialog = () => {
  const dispatch = useDispatch();

  const { open, maxWidth, fullWidth, title, contentType, actions } =
    useSelector((state) => state.dialog);

  return (
    <MUIDialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={() => dispatch(hideDialog())}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DynamicContent contentType={contentType} />
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
