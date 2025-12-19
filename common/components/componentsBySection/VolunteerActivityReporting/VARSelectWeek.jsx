import React from 'react';
import PropTypes from 'prop-types';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

/**
 * Helper to generate recent week ranges
 */
const generateWeeks = (count = 8) => {
  const weeks = [];
  const today = new Date();

  for (let i = 0; i < count; i += 1) {
    const start = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
    const end = endOfWeek(start, { weekStartsOn: 1 });

    weeks.push({
      label: `${format(start, 'MMMM d')} – ${format(end, 'MMMM d, yyyy')}`,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    });
  }

  return weeks;
};

const VARSelectWeek = ({ selectedWeek, onUpdate, errorMessage }) => {
  const weeks = generateWeeks();

  const handleChange = (e) => {
    const week = weeks.find(w => w.startDate === e.target.value);
    if (week && onUpdate) {
      onUpdate(week);
    }
  };

  return (
    <div className="VARSelectWeek-wrapper">
      <label className="VARSelectWeek-label">
        Logging Activity for Week of: <span className="required">*</span>
      </label>

      <select
        className={`VARSelectWeek-dropdown ${errorMessage ? 'error' : ''}`}
        value={selectedWeek?.startDate || ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a week
        </option>
        {weeks.map((week) => (
          <option key={week.startDate} value={week.startDate}>
            {week.label}
          </option>
        ))}
      </select>

      {!errorMessage && (
        <div className="VARSelectWeek-helper">
          Use dropdown to select an earlier week
        </div>
      )}

      {errorMessage && (
        <div className="VARSelectWeek-error">
          {errorMessage}
      </div>
      )}

    </div>
  );
};

VARSelectWeek.propTypes = {
  selectedWeek: PropTypes.shape({
    label: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }),
  onUpdate: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default VARSelectWeek;