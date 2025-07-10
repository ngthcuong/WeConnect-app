import TimeAgo from "@components/TimeAgo";
import { Comment, Send, ThumbUp } from "@mui/icons-material";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
// import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Post = ({
  id,
  authorId,
  fullName,
  content,
  image,
  likes,
  comments,
  createdAt,
  isLiked = false,
  onLike = () => {},
  onComment = () => {},
}) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isCommentOpen && commentInputRef.current)
      commentInputRef.current.focus();
  }, [isCommentOpen]);

  return (
    <div>
      <div className="rounded-sm bg-white px-4 pt-4 shadow">
        <div className="flex items-center gap-4">
          <Link to={`/user/${authorId}`}>
            <Avatar className="!bg-[#246AA3]">
              {fullName?.[0].toUpperCase()}
            </Avatar>
          </Link>
          <div>
            <Link to={`/user/${authorId}`}>
              <div className="font-bold">{fullName || "Anonymous"}</div>
            </Link>
            <div className="text-sm text-gray-500">
              {/* {dayjs(createdAt).format("DD/MM/YYYY HH:mm")} */}
              <TimeAgo date={createdAt} />
            </div>
          </div>
        </div>

        <div className="my-3">{content}</div>
        {image && <img src={image} alt="post" />}

        <div className="mt-3 flex justify-between gap-4">
          <div className="flex items-center gap-1">
            <ThumbUp
              className={isLiked ? "!text-[#246AA3]" : "!text-gray-500"}
            />{" "}
            {likes?.length || 0}
          </div>
          <div>{comments?.length || 0} comments</div>
        </div>

        <div className="mt-2 flex items-center justify-around gap-4 border-t-1 border-gray-200 pt-1">
          <Button
            startIcon={
              <ThumbUp
                className={isLiked ? "!text-[#246AA3]" : "!text-gray-500"}
              />
            }
            className={isLiked ? "!text-[#246AA3]" : "!text-gray-500"}
            style={{ textTransform: "none" }}
            onClick={() => onLike(id)}
          >
            Like
          </Button>
          <Button
            startIcon={<Comment className="!text-gray-500" />}
            className="!text-gray-500"
            style={{ textTransform: "none" }}
            onClick={() => setIsCommentOpen(!isCommentOpen)}
          >
            Comment
          </Button>
        </div>
      </div>
      {isCommentOpen && (
        <div>
          <div className="flex max-h-60 flex-col gap-4 overflow-y-auto rounded-sm bg-white px-2 py-3 shadow">
            {[...comments].reverse().map((comment) => {
              return (
                <div key={comment._id} className="mb-3 flex items-center gap-3">
                  <Avatar className="!bg-[#246AA3]">
                    {comment?.author?.fullName?.[0].toUpperCase()}
                  </Avatar>
                  <div className="">
                    <div className="flex items-center gap-10">
                      <p className="font-semibold">
                        {comment?.author?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")} */}
                        <TimeAgo date={comment.createdAt} />
                      </p>
                    </div>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-center gap-4 rounded-sm bg-white px-2 py-3 shadow">
            <div>
              <Avatar className="!bg-[#246AA3]">
                {fullName?.[0].toUpperCase()}
              </Avatar>
            </div>
            <div className="flex flex-1">
              <TextField
                fullWidth
                size="small"
                placeholder="Comment..."
                inputRef={commentInputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <IconButton
                disabled={!comment}
                onClick={() => {
                  onComment({ comment, postId: id });
                  setComment("");
                  // setIsCommentOpen(false);
                }}
                data-testid="send-comment"
              >
                <Send color={comment && "primary"} />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
