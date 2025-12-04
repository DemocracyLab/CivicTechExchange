import React, { useState } from 'react';
import VolunteerActivityReportingQ2 from '../VolunteerActivityReportingQ2';

export default {
  title: 'VolunteerActivityReporting/Q2',
  component: VolunteerActivityReportingQ2,
};

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Calculate isOverLimit based on the current value state
  const isOverLimit = value.length > 150;

  return (
    <VolunteerActivityReportingQ2
      {...args}
      value={value}
      setValue={setValue}
      isOverLimit={isOverLimit}
      isFocused={isFocused} // Pass the focus state
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export const IdleState = Template.bind({});
IdleState.args = {
  value: '',
};
IdleState.parameters = {
  docs: {
    description: {
      story: 'Default state: empty input with no error.',
    },
  },
};

export const FilledState = Template.bind({});
FilledState.args = {
  value: 'Worked on V16 of the screens. Presented at design team meeting, got feedback.',
};
FilledState.parameters = {
  docs: {
    description: {
      story: 'Input is pre-filled with a valid value.',
    },
  },
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  // Use a long value to demonstrate the error state
  value: 'I created a new version of the form screens, and then developed the user flow diagram. I also attended the weekly design meeting as well as a team meeting for this assignment. The assigmnment took a lot of time because I had to iterate on the designs multiple times based on feedback from the team. Overall, I am happy with the progress made this week and look forward to continuing to work on this project next week.',
};
ErrorState.parameters = {
  docs: {
    description: {
      story: 'Displays the validation error when the character count exceeds 150.',
    },
  },
};