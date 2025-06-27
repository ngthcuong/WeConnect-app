import {
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog as MUIDialog,
} from "@mui/material";
import { hideDialog } from "@redux/slices/dialogSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import NewPostDialog from "./configs/NewPostDialog";

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

  const { open, maxWidth, fullWidth, title, contentType } = useSelector(
    (state) => state.dialog,
  );

  return (
    <MUIDialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={() => dispatch(hideDialog())}
    >
      <DialogTitle className="flex justify-between">
        {title}
        <IconButton>
          <Close onClick={() => dispatch(hideDialog())} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DynamicContent contentType={contentType} />
      </DialogContent>
    </MUIDialog>
  );
};

export default Dialog;
