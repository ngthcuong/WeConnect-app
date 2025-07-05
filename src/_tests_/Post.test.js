import { default as Post } from "@components/NewsFeed/Post";
import { fireEvent, render, screen } from "@testing-library/react";

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
});
