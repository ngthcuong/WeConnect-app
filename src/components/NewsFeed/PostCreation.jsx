import { useUserInfo } from "@hooks/useUserInfo";
import { Avatar, Chip, TextField } from "@mui/material";
import { showDialog } from "@redux/slices/dialogSlice";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

export const ImageUploader = ({ image, setImage }) => {
  // const [image, setImage] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      setImage(acceptedFiles[0]);
    },
    [setImage],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "flex justify-center items-center bg-slate-100 px-2 rounded-sm h-14 mt-3 cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {image && (
        <div className="mt-3">
          <Chip label={image.name} onDelete={() => setImage(null)} />
        </div>
      )}
    </div>
  );
};

const PostCreation = () => {
  const dispatch = useDispatch();
  const userInfo = useUserInfo();

  return (
    <div className="flex items-center gap-4 rounded-sm bg-white p-5 shadow">
      <div>
        <Avatar className="!bg-[#246AA3]">
          {userInfo.fullName?.[0].toUpperCase()}
        </Avatar>
      </div>
      <div className="flex-1">
        <TextField
          fullWidth
          size="small"
          placeholder="What's on your mind?"
          onClick={() =>
            dispatch(
              showDialog({
                title: "Create Post",
                contentType: "newPost",
              }),
            )
          }
        />
      </div>
    </div>
  );
};

export default PostCreation;
