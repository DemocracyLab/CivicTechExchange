import React from 'react';
import VolunteerActivityReportingQ2 from '../VolunteerActivityReportingQ2';

export default {
  title: 'VolunteerActivityReporting/VolunteerActivityReportingQ2',
  component: VolunteerActivityReportingQ2,
};

/**
 * Empty / default state
 */
export const IdleState = {
  args: {
    value: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state with empty input and no validation error.',
      },
    },
  },
};

/**
 * Pre-filled valid content
 */
export const FilledState = {
  args: {
    value: 'Worked on V16 of the screens. Presented at the design team meeting and received feedback.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input is pre-filled with a valid value under the character limit.',
      },
    },
  },
};

/**
 * Character limit exceeded
 */
export const ErrorState = {
  args: {
    value:
      'I created a new version of the form screens, developed the user flow diagram, attended multiple design and team meetings, and iterated on feedback several times. This work took longer than expected but resulted in better overall outcomes.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays validation error when character count exceeds 150.',
      },
    },
  },
};
