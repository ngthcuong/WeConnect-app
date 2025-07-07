import { Button, CircularProgress } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import {
  useDeletePhotoMutation,
  useUploadPhotoMutation,
} from "@services/userApi";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

const UserPhotoUploader = ({
  title,
  footNote,
  currentImgSrc,
  isCover = false,
}) => {
  const [
    uploadPhoto,
    { isLoading, isError: isErrorUpoading, isSuccess: isSuccessUploading },
  ] = useUploadPhotoMutation();
  const [
    deletePhoto,
    {
      isLoading: isDeleting,
      isError: isErrorDeleting,
      isSuccess: isSuccessDeleting,
    },
  ] = useDeletePhotoMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccessUploading) {
      dispatch(showSnackbar({ message: "Upload image successed" }));
    }
    if (isSuccessDeleting) {
      dispatch(showSnackbar({ message: "Delete image successed" }));
    }

    if (isErrorUpoading) {
      dispatch(
        showSnackbar({ message: "Upload image failed", severity: "error" }),
      );
    }
    if (isErrorDeleting) {
      dispatch(
        showSnackbar({ message: "Delete image failed", severity: "error" }),
      );
    }
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Tạo form data
      const formData = new FormData();
      formData.append("isCover", isCover);
      formData.append("image", acceptedFiles[0]);

      uploadPhoto(formData);
    },
    [isCover, uploadPhoto],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: ".jpg,.jpeg,.png",
  });

  return (
    <div>
      <p className="mb-2 font-semibold">{title}</p>
      <div className="flex items-center gap-4">
        <img
          src={currentImgSrc ?? "https://placehold.co/100x100"}
          className={`h-24 w-24 rounded ${isCover ? "object-contain" : "object-cover"}`}
        />
        <div>
          <div>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-2 transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              } `}
            >
              <input {...getInputProps()} />
              <Button
                variant="contained"
                size="small"
                disabled={isLoading}
                style={{ textTransform: "none" }}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isLoading
                  ? "Uploading..."
                  : isDragActive
                    ? "Drop image here"
                    : "Upload new photo"}
              </Button>
            </div>
          </div>
          <Button
            variant="outlined"
            size="small"
            disabled={isDeleting}
            style={{ textTransform: "none", marginTop: "4px" }}
            startIcon={
              isDeleting ? <CircularProgress size={16} color="inherit" /> : null
            }
            onClick={() => {
              deletePhoto(isCover);
            }}
          >
            {isDeleting ? "Resetting..." : "Reset"}
          </Button>
          <p className="text-dark-400 mt-2 text-sm">{footNote}</p>
        </div>
      </div>
    </div>
  );
};
export default UserPhotoUploader;
