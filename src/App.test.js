import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the splash screen with the app name", () => {
  render(<App />);
  var matches = screen.getAllByText("ذكّر");
  expect(matches.length).toBeGreaterThan(0);
});
