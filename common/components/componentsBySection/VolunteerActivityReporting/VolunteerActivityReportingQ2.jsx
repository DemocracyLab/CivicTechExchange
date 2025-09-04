import React, { useState } from 'react';
import PropTypes from 'prop-types';

const VolunteerActivityReportingQ2 = ({ value: initialValue = '', onUpdate, error: hasError, className = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value.length;
  const isOverLimit = charCount > 150;

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onUpdate) {
      onUpdate(e.target.value);
    }
  };

  return (
    <div className={`VARQ2-wrapper ${className}`}>
      <label htmlFor="volunteer-activity-summary" className="VARQ2-label">
        In a few words, describe what you did during the week.
      </label>
      <div className={`VARQ2-input-container ${hasError || isOverLimit ? 'input-error' : ''} ${isFocused ? 'input-focused' : ''}`}>
        <textarea
          id="volunteer-activity-summary"
          name="volunteer_activity_summary"
          className="VARQ2-input"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter text..."
          rows={1}
        />
        <div className="VARQ2-counter-wrapper">
          <span className={`VARQ2-char-count ${hasError || isOverLimit ? 'error-color' : ''}`}>
            {charCount}/150
          </span>
        </div>
      </div>
      {hasError && (
        <div className="VARQ2-error-message">
          Please limit your response to 150 characters.
        </div>
      )}
    </div>
  );
};

VolunteerActivityReportingQ2.propTypes = {
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.bool,
  className: PropTypes.string,
};

export default VolunteerActivityReportingQ2;
