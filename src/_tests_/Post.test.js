import { default as Post } from "@components/NewsFeed/Post";
import { render } from "@testing-library/react";

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
});
