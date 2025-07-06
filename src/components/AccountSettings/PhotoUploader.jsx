import React, { useState } from "react";

const PhotoUploader = ({ title, discription, typeImage }) => {
  const [formData, setFormData] = useState({
    fullName: "John",
    about: "",
    avatar: null,
    coverImage: null,
  });

  const handleReset = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleFileUpload = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            [type]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div>
      <h3 className="mb-4 text-center text-base font-medium text-gray-700">
        {title}
      </h3>
      <div className="text-center">
        <div className="mb-4">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt={title}
              className={`mx-auto border-2 border-gray-200 object-cover ${
                typeImage === "avatar" ? "h-20 w-20 rounded-full" : "h-20 w-30"
              }`}
            />
          ) : (
            <div
              className={`mx-auto flex items-center justify-center bg-gray-200 ${typeImage === "avatar" ? "h-20 w-20 rounded-full" : "h-20 w-30"}`}
            >
              <svg
                className="h-8 w-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {typeImage === "avatar" && (
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                )}
                {typeImage === "cover" && (
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </div>
          )}
        </div>
        <div className="mb-3 flex justify-center gap-3">
          <button
            onClick={() => handleFileUpload("avatar")}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Upload new photo
          </button>
          <button
            onClick={() => handleReset("avatar")}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-gray-500">{discription}</p>
      </div>
    </div>
  );
};

export default PhotoUploader;
