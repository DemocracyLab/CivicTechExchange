// @flow
import * as React from 'react';
import VolunteerActivityReportingQ2 from '../VolunteerActivityReportingQ2';

export default {
  title: 'VolunteerActivityReporting/VolunteerActivityReportingQ2',
  component: VolunteerActivityReportingQ2,
};

export const Default = {
  args: {
    name: 'activity_summary',
    defaultValue: '',
    maxLength: 150,
  },
};

export const PreFilled = {
  args: {
    name: 'activity_summary',
    defaultValue: 'Made progress on API integration and wrote tests',
    maxLength: 150,
  },
};

export const NearMaxLength = {
  args: {
    name: 'activity_summary',
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ali',
    maxLength: 150,
  },
};

export const Required = {
  args: {
    name: 'activity_summary',
    defaultValue: '',
    maxLength: 150,
    required: true,
  },
};

export const ShortMaxLength = {
  args: {
    name: 'activity_summary',
    defaultValue: '',
    maxLength: 50,
  },
};

export const IdleState = {
  args: {
    name: 'activity_summary',
    defaultValue: '',
    maxLength: 150,
    error: false,
  },
};

export const FilledState = {
  args: {
    name: 'activity_summary',
    defaultValue: 'Sample Text',
    maxLength: 150,
    error: false,
  },
};

export const ErrorState = {
  args: {
    name: 'activity_summary',
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui s',
    maxLength: 150,
    error: true,
    errorMessage: 'Please limit your response to 150 characters',
  },
};

export const ErrorStateWithLongInput = {
  args: {
    name: 'activity_summary',
    defaultValue: 'This is a very long input text that definitely exceeds the maximum character limit and should trigger the error state styling with a red border',
    maxLength: 150,
    error: true,
  },
};
