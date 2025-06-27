import { ImageUploader } from "@components/NewsFeed/PostCreation";
import {
  Button,
  CircularProgress,
  DialogActions,
  TextareaAutosize,
} from "@mui/material";
import { hideDialog } from "@redux/slices/dialogSlice";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useCreatePostMutation } from "@services/rootApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const NewPostDialog = () => {
  const dispatch = useDispatch();

  const [createNewPost, { isLoading }] = useCreatePostMutation();

  const [content, setContent] = useState("");

  const onSubmit = async () => {
    // Sử dụng unwrap() để bắt lỗi từ server
    try {
      await createNewPost({ content }).unwrap();
      //   Nhận data và thông báo thành công
      dispatch(
        showSnackbar({
          message: "Post created successfully",
        }),
      );
      dispatch(hideDialog());
      setContent("");
    } catch (error) {
      // Xử lý lỗi từ server
      dispatch(
        showSnackbar({ message: error?.data?.message, severity: "error" }),
      );
    }
  };

  return isLoading ? (
    <CircularProgress
      className="mx-auto flex items-center justify-center"
      size={24}
    />
  ) : (
    <div>
      <TextareaAutosize
        className="w-full p-2"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ImageUploader />
      <DialogActions className="flex justify-end">
        <Button
          variant="outlined"
          color="error"
          onClick={() => dispatch(hideDialog())}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Post
        </Button>
      </DialogActions>
    </div>
  );
};

export default NewPostDialog;
