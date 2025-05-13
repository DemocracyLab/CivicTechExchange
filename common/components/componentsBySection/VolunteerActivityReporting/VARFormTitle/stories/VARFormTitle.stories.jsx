import React from 'react';
import VARFormTitle from '../VARFormTitle';

export default {
    title: 'VolunteerActivityReporting/VARFormTitle',
    component: VARFormTitle,
    argTypes: {
        formTitle: {
            control: 'text',
        },
    },
};

const Template = (args) => <VARFormTitle {...args} />

export const Default = Template.bind({});
Default.args = {
    formTitle: 'Weekly Activity Report'
};
