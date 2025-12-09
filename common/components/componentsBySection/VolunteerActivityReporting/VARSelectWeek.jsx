// @flow
import * as React from 'react';

type Props = {|
  name?: string,
  defaultValue?: string,
  errorMessage?: ?string,
  weeksBack?: number,
  allowFuture?: boolean,
|};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getWeekStart(date: Date): Date {
  // Return Monday as week start
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function VARSelectWeek({
  name = 'week_start',
  defaultValue,
  errorMessage,
  weeksBack = 12,
  allowFuture = false,
}: Props): React.Node {
  const today = new Date();
  const start = getWeekStart(today);
  const options = [];

  for (let i = 0; i < weeksBack; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - i * 7);
    const iso = isoDate(weekStart);
    const labelStart = weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const labelEnd = weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    options.push({ value: iso, label: `${labelStart} - ${labelEnd}` });
  }

  // optional future weeks
  if (allowFuture) {
    const future = new Date(start);
    future.setDate(start.getDate() + 7);
    options.unshift({ value: isoDate(future), label: 'Next week' });
  }

  return (
    <div className="var-select-week">
      <label className="var-select-week__label">Week</label>
      <select name={name} defaultValue={defaultValue || ''} className="var-select-week__select">
        <option value="">Select a week</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errorMessage && <div className="var-select-week__error">{errorMessage}</div>}
    </div>
  );
}
