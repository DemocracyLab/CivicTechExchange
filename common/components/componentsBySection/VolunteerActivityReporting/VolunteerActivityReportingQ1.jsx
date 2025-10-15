import React, { useState } from 'react';
import PropTypes from 'prop-types';

const VolunteerActivityReportingQ1 = ({ initialValue = 0.0, hasError, className = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (newValue >= 0 || isNaN(newValue)) {
      setValue(e.target.value);
    }
  };

  return (
    <div className={`VARQ1-wrapper ${className}`}>
      <label className="VARQ1-label">
        About how many hours did you spend on this project for the week (rounded to the nearest quarter-hour)?
        <span className="required-asterisk"> *</span>
      </label>
      <div className="VARQ1-example">
        Ex: For four hours and fifteen minutes, enter 4.25 (30 mins. = .5; 45 mins. = .75)
      </div>
      <div className="VARQ1-input-row">
        <input
          name="hours_spent"
          type="number"
          className={`VARQ1-input ${hasError ? 'input-error' : ''}`}
          value={value}
          onChange={handleChange}
          step="0.25"
          min="0"
        />
        <span className="VARQ1-hours-label">Hour(s)</span>
      </div>
      {hasError && (
        <div className="error-message">
          Please enter your hours as a numeral. If no activity, toggle the log activity switch above to OFF.
        </div>
      )}
    </div>
  );
};

VolunteerActivityReportingQ1.propTypes = {
  initialValue: PropTypes.number,
  hasError: PropTypes.bool,
  className: PropTypes.string,
};

export default VolunteerActivityReportingQ1;


