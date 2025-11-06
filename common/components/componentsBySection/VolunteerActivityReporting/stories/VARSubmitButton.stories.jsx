import React from "react";
import { useState } from "react";
import VARSubmitButton from "../VARSubmitButton.jsx";
import { within, userEvent, waitFor } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  title: "VolunteerActivityReporting/VARSubmitButton",
  component: VARSubmitButton,
};

export const Default = {
  args: {
    isClicked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /submit/i });
    
    // Verify button is present and enabled
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    
    // Verify default styling (orange background, regular text)
    expect(button).toHaveClass("var-submit-button");
    expect(button).not.toHaveClass("var-submit-button--clicked");
  },
};

export const Clicked = {
  args: {
    isClicked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /submit/i });
    
    // Verify button is present and still enabled (not auto-disabled)
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    
    // Verify clicked styling (gray background, bold text)
    expect(button).toHaveClass("var-submit-button");
    expect(button).toHaveClass("var-submit-button--clicked");
  },
};

export const Interactive = () => {
  const [isClicked, setIsClicked] = useState(false);
  
  return (
    <div style={{ padding: "20px" }}>
      <h3>Interactive Example</h3>
      <p>Click the button to toggle between orange (regular) and gray (bold) states:</p>
      <VARSubmitButton
        isClicked={isClicked}
        onClick={() => {
          setIsClicked(true);
          // Reset after 3 seconds to show the transition
          setTimeout(() => setIsClicked(false), 3000);
        }}
      />
      {isClicked && (
        <p data-testid="success-message" style={{ marginTop: "20px", color: "green" }}>
          ✓ Button clicked! State will reset in 3 seconds...
        </p>
      )}
    </div>
  );
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole("button", { name: /submit/i });
  
  // Initially button should not have clicked class
  expect(button).not.toBeDisabled();
  expect(button).not.toHaveClass("var-submit-button--clicked");
  
  // Click the button
  await userEvent.click(button);
  
  // After click, button should show clicked state (gray, bold)
  await waitFor(() => {
    expect(button).toHaveClass("var-submit-button--clicked");
  });
  
  // Success message should appear
  await waitFor(() => {
    expect(canvas.getByTestId("success-message")).toBeInTheDocument();
  });
};

export const InFormContext = () => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsClicked(true);
    // Reset after 3 seconds
    setTimeout(() => setIsClicked(false), 3000);
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h3>Within a Form</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Hours Worked *
          </label>
          <input
            type="number"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Activity Summary *
          </label>
          <input
            type="text"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        <VARSubmitButton isClicked={isClicked} />
      </form>
    </div>
  );
};

export const BothStatesComparison = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h3>Side-by-Side Comparison</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <p style={{ marginBottom: "10px" }}>
            <strong>isClicked=false</strong>
            <br />
            Orange background, regular text
          </p>
          <VARSubmitButton
            isClicked={false}
            onClick={() => alert("Not clicked state")}
          />
        </div>
        <div>
          <p style={{ marginBottom: "10px" }}>
            <strong>isClicked=true</strong>
            <br />
            Gray background, bold text
          </p>
          <VARSubmitButton
            isClicked={true}
            onClick={() => alert("Clicked state")}
          />
        </div>
      </div>
    </div>
  );
};

export const DesktopView = {
  args: {
    isClicked: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop1',
    },
  },
};

export const MobileView = {
  args: {
    isClicked: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileViewClicked = {
  args: {
    isClicked: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};


