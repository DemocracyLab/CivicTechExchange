// @flow
import * as React from 'react';
import VolunteerActivityReportingCardIntro from '../VolunteerActivityReportingCardIntro';

export default {
  title: 'VolunteerActivityReporting/VolunteerActivityReportingCardIntro',
  component: VolunteerActivityReportingCardIntro,
};

export const Default = {
  args: {
    projectName: 'Democracy Lab Project',
    projectId: '1',
    defaultChecked: false,
  },
};

export const Checked = {
  args: {
    projectName: 'Open Data Project',
    projectId: '2',
    defaultChecked: true,
  },
};

export const UncheckedWithHint = {
  args: {
    projectName: 'Community Engagement Project',
    projectId: '3',
    defaultChecked: false,
  },
};

export const LongProjectName = {
  args: {
    projectName: 'Building Accessible Government Data Portals for Civic Technology Innovation',
    projectId: '4',
    defaultChecked: false,
  },
};
