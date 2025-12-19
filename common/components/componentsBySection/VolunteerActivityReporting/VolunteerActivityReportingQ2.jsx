import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VolunteerActivityReportingQ2 = ({ className = '', value: propValue = '' }) => {
  const [value, setValue] = useState(propValue);

  // Keep internal state in sync if parent value changes (e.g. fetched data)
  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const charCount = value.length;
  const isOverLimit = charCount > 150;

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={`VARQ2-wrapper ${className}`}>
      <label htmlFor="volunteer-activity-summary" className="VARQ2-label">
        In a few words, describe what you did during the week.
      </label>

      <div className={`VARQ2-input-container ${isOverLimit ? 'over-limit' : ''}`}>
        <textarea
          id="volunteer-activity-summary"
          name="volunteer_activity_summary"
          className="VARQ2-input"
          value={value}
          onChange={handleChange}
          placeholder="Enter text..."
          rows={1}
        />

        <div className="VARQ2-counter-wrapper">
          <span className={`VARQ2-char-count ${isOverLimit ? 'error-color' : ''}`}>
            {charCount}/150
          </span>
        </div>
      </div>

      {isOverLimit && (
        <div className="VARQ2-error-message">
          Please limit your response to 150 characters.
        </div>
      )}
    </div>
  );
};

VolunteerActivityReportingQ2.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
};

export default VolunteerActivityReportingQ2;
