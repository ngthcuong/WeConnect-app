import { Button, CircularProgress } from "@mui/material";
import {
  useDeletePhotoMutation,
  useUploadPhotoMutation,
} from "@services/userApi";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UserPhotoUploader = ({ title, footNote, currentImgSrc, isCover }) => {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

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

  const { getRootProps, getInputProps } = useDropzone({
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
          className="h-24 w-24 rounded object-cover"
        />
        <div>
          <div>
            <div {...getRootProps()}>
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
                {isLoading ? "Uploading..." : "Upload new photo"}
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
