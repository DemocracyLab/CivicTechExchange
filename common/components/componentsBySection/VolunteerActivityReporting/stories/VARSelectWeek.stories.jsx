import React, { useState } from 'react';
import VARSelectWeek from '../VARSelectWeek';

export default {
  title: 'VolunteerActivityReporting/VARSelectWeek',
  component: VARSelectWeek,
};

const Wrapper = (args) => {
  const [week, setWeek] = useState(args.selectedWeek);

  return (
    <VARSelectWeek
      {...args}
      selectedWeek={week}
      onUpdate={(selectedWeek) => {
        setWeek(selectedWeek);
        console.log('Selected week:', selectedWeek);
      }}
    />
  );
};

export const DefaultState = {
  render: Wrapper,
  args: {
    selectedWeek: null,
  },
};

export const SelectedWeek = {
  render: Wrapper,
  args: {
    selectedWeek: {
      label: 'August 8 – August 14, 2022',
      startDate: '2022-08-08',
      endDate: '2022-08-14',
    },
  },
};

export const ErrorState = {
  render: Wrapper,
  args: {
    selectedWeek: {
      label: 'August 8 – August 14, 2022',
      startDate: '2022-08-08',
      endDate: '2022-08-14',
    },
    errorMessage: 'Report already submitted. Please select a different week to log activity.',
  },
};
