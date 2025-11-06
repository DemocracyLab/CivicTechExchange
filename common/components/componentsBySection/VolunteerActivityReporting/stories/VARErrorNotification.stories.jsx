import React from "react";
import VARErrorNotification from "../VARErrorNotification.jsx";

export default {
  title: "VolunteerActivityReporting/VARErrorNotification",
  component: VARErrorNotification,
};

export const Default = {
  args: {
    showError: true,
  },
};

export const Hidden = {
  args: {
    showError: false,
  },
};

export const InFormContext = () => (
  <div style={{ padding: "20px", maxWidth: "600px" }}>
    <h3>Volunteer Activity Report</h3>
    
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px" }}>
        Hours Worked *
      </label>
      <input type="number" style={{ width: "100%", padding: "8px" }} />
    </div>
    
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px" }}>
        Activity Summary *
      </label>
      <input type="text" style={{ width: "100%", padding: "8px" }} />
    </div>
    
    <VARErrorNotification showError={true} />
    
    <button style={{ marginTop: "20px", padding: "10px 20px" }}>
      Submit Report
    </button>
  </div>
);

export const DesktopView = {
  args: {
    showError: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop1',
    },
  },
};

export const MobileView = {
  args: {
    showError: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
