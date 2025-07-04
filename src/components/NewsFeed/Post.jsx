import { Comment, ThumbUp } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const Post = ({
  id,
  fullName,
  content,
  image,
  likes,
  comments,
  createdAt,
  onLike = () => {},
}) => {
  return (
    <div className="rounded-sm bg-white px-4 pt-4 shadow">
      <div className="flex items-center gap-4">
        <div>
          <Avatar className="!bg-[#246AA3]">
            {fullName?.[0].toUpperCase()}
          </Avatar>
        </div>
        <div>
          <div className="font-bold">{fullName || "Anonymous"}</div>
          <div className="text-sm text-gray-500">
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      </div>

      <div className="my-3">{content}</div>
      {image && <img src={image} alt="post" />}

      <div className="mt-3 flex justify-between gap-4">
        <div className="flex items-center gap-1">
          <ThumbUp className="!text-[#246AA3]" /> {likes?.length || 0}
        </div>
        <div>{comments?.length || 0} comments</div>
      </div>

      <div className="mt-2 flex items-center justify-around gap-4 border-t-1 border-gray-200 pt-1">
        <Button
          startIcon={<ThumbUp className="!text-[#246AA3]" />}
          className="!text-gray-500"
          style={{ textTransform: "none" }}
          onClick={() => onLike(id)}
        >
          Like
        </Button>
        <Button
          startIcon={<Comment className="!text-gray-500" />}
          className="!text-gray-500"
          style={{ textTransform: "none" }}
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default Post;
