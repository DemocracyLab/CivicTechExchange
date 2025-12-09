// @flow
import * as React from 'react';
import VARSelectWeek from '../VARSelectWeek';

export default {
  title: 'VolunteerActivityReporting/VARSelectWeek',
  component: VARSelectWeek,
};

export const Default = {
  args: {
    name: 'week_start',
    weeksBack: 12,
    allowFuture: false,
  },
};

export const WithError = {
  args: {
    name: 'week_start',
    errorMessage: 'Please choose a week',
    weeksBack: 4,
  },
};

export const WithDefaultValue = {
  args: {
    name: 'week_start',
    defaultValue: '2025-11-17',
    weeksBack: 12,
    allowFuture: false,
  },
};

export const ErrorWithLongMessage = {
  args: {
    name: 'week_start',
    errorMessage: 'Invalid date range. Please select a week within the last 12 weeks.',
    weeksBack: 12,
  },
};

export const LimitedWeeksBack = {
  args: {
    name: 'week_start',
    weeksBack: 4,
    allowFuture: false,
  },
};
