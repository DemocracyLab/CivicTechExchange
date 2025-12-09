import React from 'react';
import VolunteerActivityReportingQ1 from '../VolunteerActivityReportingQ1'; 


export default {
  title: 'VolunteerActivityReporting/VolunteerActivityReportingQ1',
  component: VolunteerActivityReportingQ1,
};


export const Default ={
  args:{
  initialValue: 0.0,
  hasError: false,
},
  docs: {
    description: {
      story: 'Default state: empty input with no error.',
    },
  },
};

export const FilledInput = {
args: {
  initialValue: 3.5,
  hasError: false,
},
docs: {
    description: {
      story: 'Input is pre-filled with a valid value (e.g., 3.5 hours).',
    },
  },
};

export const ValidationError = {
args : {
  initialValue: '',
  hasError: true,
},
docs: {
    description: {
      story: 'Displays the validation error with a red border and message.',
    },
  },
};

export const Input_1_75 = {
args : {
  initialValue: 1.75,
  hasError: false,
}
};

export const Input_4_25 ={
args : {
  initialValue: 4.25,
  hasError: false,
}
};

export const Input_2_0 = {
args : {
  initialValue: 2.0,
  hasError: false,
}
};

