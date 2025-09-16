import React from 'react';
import PropTypes from 'prop-types';

// The component is 'controlled' by its parent
const VolunteerActivityReportingQ2 = ({ className = '', value, setValue, isOverLimit, onFocus, onBlur, isFocused }) => {
  const charCount = value.length;

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={`VARQ2-wrapper ${className}`}>
      <label htmlFor="volunteer-activity-summary" className="VARQ2-label">
        In a few words, describe what you did during the week.
      </label>
      <div
        className={`VARQ2-input-container 
          ${isOverLimit ? 'over-limit' : ''} 
          ${isFocused ? 'input-focused' : ''}`}
      >
        <textarea
          id="volunteer-activity-summary"
          name="volunteer_activity_summary"
          className="VARQ2-input"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
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
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  isOverLimit: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default VolunteerActivityReportingQ2;