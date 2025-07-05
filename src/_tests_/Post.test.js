import { default as Post } from "@components/NewsFeed/Post";
import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";

describe("Post Component", () => {
  test("should render post component", () => {
    const { getByText } = render(
      <Post
        content={"Hello World"}
        fullName={"John Doe"}
        createdAt={new Date().toISOString()}
      />,
    );
    expect(getByText("Hello World")).toBeInTheDocument();
  });

  test("display correct number of likes", () => {
    const { getByText } = render(
      <Post
        likes={[1, 2, 3, 4]}
        content={"Hello World"}
        fullName={"John Doe"}
        createdAt={new Date().toISOString()}
      />,
    );
    expect(getByText("4")).toBeInTheDocument();
  });

  test("run onLike function with id when click on Like button", () => {
    const mockOnLike = jest.fn();
    const tempId = crypto.randomUUID();
    render(
      <Post
        id={tempId}
        content={"Hello World"}
        fullName={"John Doe"}
        createdAt={new Date().toISOString()}
        onLike={mockOnLike}
      />,
    );

    const likeButton = screen.getByText("Like");
    fireEvent.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledWith(tempId);
  });

  test("render correct number of comments", () => {
    const tempId = crypto.randomUUID();
    const comments = [
      {
        _id: "1",
        comment: "Comment 1",
        createdAt: dayjs().toISOString(),
      },
      {
        _id: "1",
        comment: "Comment 1",
        createdAt: dayjs().toISOString(),
      },
    ];

    render(
      <Post
        id={tempId}
        content={"Hello World"}
        fullName={"John Doe"}
        createdAt={Date.now()}
        comments={comments}
      />,
    );

    expect(screen.getByText("2 comments")).toBeInTheDocument();
  });

  test("toggles comment box when Comment button is clicked", () => {
    render(
      <Post
        id="holetex123"
        fullName="Tung HoleTex"
        content="Hello World"
        createdAt={Date.now()}
        comments={[]}
      />,
    );

    expect(screen.queryByPlaceholderText("Comment...")).toBeNull();

    const commentBtn = screen.getByText("Comment");
    fireEvent.click(commentBtn);

    expect(screen.queryByPlaceholderText("Comment...")).toBeInTheDocument();
  });

  test("calls onComment callback when sending a comment", () => {
    const mockOnComment = jest.fn();
    const tempId = crypto.randomUUID();
    render(
      <Post
        id={tempId}
        content={"Hello World"}
        fullName={"John Doe"}
        createdAt={Date.now()}
        comments={[]}
        onComment={mockOnComment}
      />,
    );

    const commentBtn = screen.getByText("Comment");
    fireEvent.click(commentBtn);

    const commentInput = screen.getByPlaceholderText("Comment...");
    fireEvent.change(commentInput, { target: { value: "Hello World" } });

    const sendBtn = screen.getByTestId("send-comment");
    fireEvent.click(sendBtn);

    expect(mockOnComment).toHaveBeenCalledWith({
      comment: "Hello World",
      postId: tempId,
    });
  });
});
