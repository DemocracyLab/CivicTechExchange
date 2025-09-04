import React from 'react';
import VolunteerActivityReportingQ2 from '../VolunteerActivityReportingQ2';

export default {
  title: 'VolunteerActivityReporting/Q2',
  component: VolunteerActivityReportingQ2,
};

export const IdleState = {
  args: {
    value: '',
    onUpdate: (value) => console.log('Updated value:', value),
    error: false,
  },
  docs: {
    description: {
      story: 'Default state: empty input with no error.',
    },
  },
};

export const FilledState = {
  args: {
    value: 'Worked on V16 of the screens. Presented at design team meeting, got feedback.',
    onUpdate: (value) => console.log('Updated value:', value),
    error: false,
  },
  docs: {
    description: {
      story: 'Input is pre-filled with a valid value.',
    },
  },
};

export const ErrorState = {
  args: {
    value: 'I created a new version of the form screens, and then developed the user flow diagram. I also attended the weekly design meeting as well as a team meeting for this assignment. The assigmnment took a lot of time because I had to iterate on the designs multiple times based on feedback from the team. Overall, I am happy with the progress made this week and look forward to continuing to work on this project next week.',
    onUpdate: (value) => console.log('Updated value:', value),
    error: true,
  },
  docs: {
    description: {
      story: 'Displays the validation error when the character count exceeds 150.',
    },
  },
};