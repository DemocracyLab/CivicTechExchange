import VolunteerActivityReportingCardIntro from '../VolunteerActivityReportingCardIntro';

export default {
  title: 'VolunteerActivityReporting/VARCardIntro',
  component: VolunteerActivityReportingCardIntro,
};

export const DefaultState = {
  args: {
    projectName: 'DemocracyLab',
    logActivity: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays project name with log activity toggle enabled.',
      },
    },
  },
};

export const NoActivity = {
  args: {
    projectName: 'DemocracyLab',
    logActivity: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays placeholder message when there is no activity to log.',
      },
    },
  },
};

export const Interaction = {
  args: {
    projectName: 'DemocracyLab',
    logActivity: true,
    onUpdate: (state) => {
      console.log('Updated state:', state);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggling the switch updates the internal state and triggers onUpdate.',
      },
    },
  },
};
