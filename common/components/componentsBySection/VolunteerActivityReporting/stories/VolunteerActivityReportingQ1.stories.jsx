import React from 'react';
import VolunteerActivityReportingQ1 from '../VolunteerActivityReportingQ1'; 


export default {
  title: 'VolunteerActivityReporting/VolunteerAactivityReportingQ1',
  component: VolunteerActivityReportingQ1,
};

const Template = (args) => <VolunteerActivityReportingQ1 {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialValue: 0.0,
  hasError: false,
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default state: empty input with no error.',
    },
  },
};

export const FilledInput = Template.bind({});
FilledInput.args = {
  initialValue: 3.5,
  hasError: false,
};
FilledInput.parameters = {
  docs: {
    description: {
      story: 'Input is pre-filled with a valid value (e.g., 3.5 hours).',
    },
  },
};

export const ValidationError = Template.bind({});
ValidationError.args = {
  initialValue: '',
  hasError: true,
};
ValidationError.parameters = {
  docs: {
    description: {
      story: 'Displays the validation error with a red border and message.',
    },
  },
};

export const Input_1_75 = Template.bind({});
Input_1_75.args = {
  initialValue: 1.75,
  hasError: false,
};

export const Input_4_25 = Template.bind({});
Input_4_25.args = {
  initialValue: 4.25,
  hasError: false,
};

export const Input_2_0 = Template.bind({});
Input_2_0.args = {
  initialValue: 2.0,
  hasError: false,
};

