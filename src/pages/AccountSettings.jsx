import React, { useState } from "react";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "John",
    about: "",
    avatar: null,
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleReset = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData);
  };

  const handleCancel = () => {
    setFormData({
      fullName: "John",
      about: "",
      avatar: null,
      coverImage: null,
    });
  };

  return (
    <div className="mx-auto mt-4 min-h-screen max-w-4xl bg-gray-50">
      {/* Content */}
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-medium text-gray-800">
          Profile Details
        </h2>

        {/* Profile Images */}
        <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Avatar Section */}
          <div>
            <h3 className="mb-4 text-base font-medium text-gray-700">Avatar</h3>
            <div className="text-center">
              <div className="mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="mx-auto h-20 w-20 rounded-full border-2 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
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
              <p className="text-xs text-gray-500">Allowed JPG, GIF or PNG.</p>
            </div>
          </div>

          {/* Cover Image Section */}
          <div>
            <h3 className="mb-4 text-base font-medium text-gray-700">
              Cover Image
            </h3>
            <div className="text-center">
              <div className="mb-4">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="mx-auto h-20 w-32 rounded-lg border-2 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-20 w-32 items-center justify-center rounded-lg bg-gray-200">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mb-3 flex justify-center gap-3">
                <button
                  onClick={() => handleFileUpload("coverImage")}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Upload new photo
                </button>
                <button
                  onClick={() => handleReset("coverImage")}
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-gray-500">Allowed JPG or PNG.</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mb-8 space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="about"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveChanges}
            className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md bg-gray-500 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
