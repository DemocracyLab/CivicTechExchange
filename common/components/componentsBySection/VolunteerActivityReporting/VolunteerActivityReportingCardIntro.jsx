import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VolunteerActivityReportingCardIntro = ({
  className = '',
  style,
  projectName,
  logActivity: propLogActivity = true,
  onUpdate,
}) => {
  const [logActivity, setLogActivity] = useState(propLogActivity);

  // Sync state if parent updates logActivity (e.g. fetched data)
  useEffect(() => {
    setLogActivity(propLogActivity);
  }, [propLogActivity]);

  const handleToggle = () => {
    const updatedValue = !logActivity;
    setLogActivity(updatedValue);

    if (onUpdate) {
      onUpdate({ logActivity: updatedValue });
    }
  };

  return (
    <div
      className={`VARCardIntro-wrapper ${className}`}
      style={style}
    >
      <div className="VARCardIntro-header">
        <span className="VARCardIntro-project">
          Project: {projectName}
        </span>

        <label className="VARCardIntro-toggle">
          <input
            type="checkbox"
            checked={logActivity}
            onChange={handleToggle}
          />
          <span className="VARCardIntro-slider" />
        </label>
      </div>

      <div className="VARCardIntro-message">
        {logActivity
          ? 'Log activity for this project'
          : 'No activity to log'}
      </div>
    </div>
  );
};

VolunteerActivityReportingCardIntro.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  projectName: PropTypes.string.isRequired,
  logActivity: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default VolunteerActivityReportingCardIntro;
