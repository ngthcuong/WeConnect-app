import PhotoUploader from "@components/AccountSettings/PhotoUploader";
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
          <PhotoUploader
            title={"Avatar"}
            discription={"Allowed JPG or PNG."}
            typeImage={"avatar"}
          />

          {/* Cover Image Section */}
          <PhotoUploader
            title={"Cover Image"}
            discription={"Allowed JPG or PNG."}
            typeImage={"cover"}
          />
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
