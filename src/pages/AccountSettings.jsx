import UserPhotoUploader from "@components/AccountSettings/PhotoUploader";
import UpdateUserInfoForm from "@components/AccountSettings/UpdateUserInfoForm";
import { useUserInfo } from "@hooks/useUserInfo";
import React from "react";

const AccountSettings = () => {
  const { image, coverImage } = useUserInfo();

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
          <UserPhotoUploader
            title={"Avatar"}
            footNote={"Allowed JPG or PNG."}
            currentImgSrc={image}
          />

          {/* Cover Image Section */}
          <UserPhotoUploader
            title={"Cover Image"}
            footNote={"Allowed JPG or PNG."}
            currentImgSrc={coverImage}
            isCover={true}
          />
        </div>

        {/* Form Fields */}
        <div className="mb-8 space-y-6">
          <UpdateUserInfoForm />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
