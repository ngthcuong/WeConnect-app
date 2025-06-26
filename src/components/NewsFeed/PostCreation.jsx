import { useUserInfo } from "@hooks/useUserInfo";
import { Avatar, TextField } from "@mui/material";
import { showDialog } from "@redux/slices/dialogSlice";
import React from "react";
import { useDispatch } from "react-redux";

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
                content: (
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="What's on your mind?"
                    />
                  </div>
                ),
              }),
            )
          }
        />
      </div>
    </div>
  );
};

export default PostCreation;
