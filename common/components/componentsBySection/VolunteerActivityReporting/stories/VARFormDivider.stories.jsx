import React from "react";
import VARFormDivider from "../VARFormDivider.jsx";

export default {
  title: "VolunteerActivityReporting/VARFormDivider",
  component: VARFormDivider,
};

export const Default = {
  args: {},
};

export const WithCustomClass = () => (
  <div style={{ padding: "20px", maxWidth: "600px" }}>
    <p>Content above divider</p>
    <VARFormDivider className="custom-divider" />
    <p>Content below divider</p>
  </div>
);

export const MultipleDividers = () => (
  <div style={{ padding: "20px", maxWidth: "600px" }}>
    <h3>Section 1</h3>
    <p>Some content here</p>
    <VARFormDivider />
    
    <h3>Section 2</h3>
    <p>More content here</p>
    <VARFormDivider />
    
    <h3>Section 3</h3>
    <p>Final content</p>
  </div>
);

export const DesktopView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop1',
    },
  },
};

export const MobileView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
