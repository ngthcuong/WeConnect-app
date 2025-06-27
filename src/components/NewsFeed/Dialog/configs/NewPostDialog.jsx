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
  const [image, setImage] = useState(null);

  const isValid = content || image;

  const onSubmit = async () => {
    // Sử dụng unwrap() để bắt lỗi từ server
    try {
      // Tạo formData để gửi lên server với kiểu multipart/form-data
      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", image);

      await createNewPost(formData).unwrap();
      //   Nhận data và thông báo thành công
      dispatch(
        showSnackbar({
          message: "Post created successfully",
        }),
      );
      dispatch(hideDialog());
      setContent("");
      setImage(null); // Xóa ảnh sau khi đăng bài thành công
    } catch (error) {
      // Xử lý lỗi từ server
      dispatch(
        showSnackbar({ message: error?.data?.message, severity: "error" }),
      );
    }
  };

  return isLoading ? (
    <div className="mx-auto flex items-center justify-center">
      <CircularProgress size={24} />
    </div>
  ) : (
    <div>
      <TextareaAutosize
        className="w-full p-2"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ImageUploader image={image} setImage={setImage} />
      <DialogActions className="flex justify-end">
        <Button
          variant="outlined"
          color="error"
          onClick={() => dispatch(hideDialog())}
        >
          Cancel
        </Button>
        {isValid ? (
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Post
          </Button>
        ) : (
          <Button variant="contained" color="primary" disabled>
            Post
          </Button>
        )}
      </DialogActions>
    </div>
  );
};

export default NewPostDialog;
